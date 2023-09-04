import { addDays } from '$lib/addDays';
import { weeksSchema } from '$lib/schema/paramsWeeksSchema';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation.js';
import { useCombinedAuthGuard } from '$lib/server/authGuard.js';
import { db } from '$lib/server/db/db.js';
import { orderLine, userOrderConfig, week } from '$lib/server/db/schema/snackSchema.js';
import { user } from '$lib/server/db/schema/userSchema';
import { logging } from '$lib/server/logging.js';
import { serverEnv } from '$lib/server/serverEnv';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { redirect } from '@sveltejs/kit';
import { eq, and, lte, gte } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const getPeriodUserInfo = async ({ targetDate, userId }: { targetDate: Date; userId: string }) => {
	const dateInformation = await generateDateInformation({
		targetDate,
		frequency: serverEnv.FREQUENCY,
		startDay: serverEnv.START_DAY,
		daysToAllowOrdering: serverEnv.DAYS_TO_ALLOW_ORDERING,
		orderLead: serverEnv.ORDER_LEAD,
		nowDate: new Date()
	});

	const userInformation = await db.query.user.findFirst({
		where: eq(user.id, userId),
		with: {
			userOrderConfig: true
		}
	});

	if (!userInformation?.userOrderConfig?.enabled) {
		// logging.info("No User Order Config or it's not enabled");
		return { dateInformation };
	}

	const userSpend = userInformation?.userOrderConfig.amount;

	const userOrderRow = await db.query.userOrderConfig.findFirst({
		where: eq(userOrderConfig.userId, userId)
	});

	if (!userOrderRow) {
		logging.info('No User Order Config');
		return { dateInformation };
	}

	const periodInformation = await db.query.week.findFirst({
		where: and(
			lte(week.startDate, dateInformation.midPeriod),
			gte(week.endDate, dateInformation.midPeriod)
		),
		with: {
			options: { with: { snack: { with: { snackGroup: true } } } },
			orders: {
				where: eq(orderLine.userOrderConfigId, userOrderRow.id),
				with: {
					snack: { with: { snack: { with: { snackGroup: true } } } },
					userOrderConfig: { with: { user: true } }
				}
			}
		}
	});

	if (!periodInformation) {
		return { dateInformation };
	}

	const totalSpent = periodInformation?.orders.reduce((accumulator, currentValue) => {
		return accumulator + currentValue.snack.priceCents;
	}, 0);

	const remainingSpend = userSpend - totalSpent;

	const groupInfo = periodInformation.options.reduce<
		{ id: string; title: string; limit: number | null; orderCount: number; limitReached: boolean }[]
	>((accumulator, currentValue) => {
		const existingIds = accumulator.map((currentGroup) => currentGroup.id);
		if (existingIds.includes(currentValue.snack.snackGroup.id)) {
			return accumulator;
		}

		const orderCount = periodInformation.orders.filter(
			(current) => current.snack.snack.snackGroup.id === currentValue.snack.snackGroup.id
		).length;

		const limitReached = Boolean(
			currentValue.snack.snackGroup.limit && orderCount >= currentValue.snack.snackGroup.limit
		);

		return [...accumulator, { ...currentValue.snack.snackGroup, orderCount, limitReached }];
	}, []);

	const snackInfo = periodInformation.options.map((currentOption) => {
		const orderCount = periodInformation.orders.filter(
			(current) => current.snack.snack.id === currentOption.snack.id
		).length;

		const group = groupInfo.find(
			(currentGroup) => currentGroup.id === currentOption.snack.snackGroup.id
		);

		if (!group) {
			throw new Error('No Group Found');
		}

		const limitReached = Boolean(
			currentOption.snack.maxQuantity && orderCount >= currentOption.snack.maxQuantity
		);

		const disabled = Boolean(
			group.limitReached || limitReached || currentOption.priceCents > remainingSpend
		);

		return {
			id: currentOption.id,
			title: currentOption.snack.title,
			priceCents: currentOption.priceCents,
			special: currentOption.special,
			normalPrice: currentOption.snack.priceCents,
			specialPrice: currentOption.priceCents,
			orderCount,
			group: group.title,
			groupId: group.id,
			disabled,
			imageFilename: currentOption.snack.imageFilename,
			limit: currentOption.snack.maxQuantity,
			limitReached,
			canAdd: dateInformation.canOrder
		};
	});

	const spendingInfo = {
		totalSpent,
		remainingSpend: userSpend - totalSpent,
		userSpend
	};

	const currentOrderItems = periodInformation.orders
		.map((currentOrder) => {
			return {
				id: currentOrder.id,
				snackId: currentOrder.snack.id,
				snackTitle: currentOrder.snack.snack.title,
				snackPrice: currentOrder.snack.priceCents,
				snackSpecial: currentOrder.snack.special,
				snackImageFilename: currentOrder.snack.snack.imageFilename,
				snackNormalPrice: currentOrder.snack.snack.priceCents,
				canRemove: dateInformation.canOrder
			};
		})
		.sort((a, b) => a.snackTitle.localeCompare(b.snackTitle));

	return {
		dateInformation,
		spendingInfo,
		snackInfo,
		groupInfo,
		periodId: periodInformation.id,
		currentOrderItems
	};
};

export const load = async ({ locals, route, url }) => {
	useCombinedAuthGuard({ locals, route });

	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const processedParams = validateSearchParams(url, weeksSchema.passthrough().parse);

	const data = processedParams;

	const targetDate = new Date(data.date);

	return {
		orderingInfo: getPeriodUserInfo({ targetDate, userId: locals.user.userId })
	};
};

export const actions = {
	addSnack: async ({ request, locals }) => {
		const form = await request.formData();
		const snackId = form.get('snackId')?.toString();
		const periodId = form.get('weekId')?.toString();
		const userId = form.get('userId')?.toString();

		if (!snackId || !periodId || !userId) {
			logging.info('Missing Form Information', { snackId, periodId, userId });
			return;
		}

		const authUser = locals.user;

		if (!authUser || authUser.userId !== userId) {
			logging.info('User Not Logged In', { userId, authUser });
			return;
		}

		const periodData = await db.query.week.findFirst({
			where: eq(week.id, periodId)
		});

		if (!periodData) {
			logging.info('No Period Data', { periodId });
			return;
		}

		const confirmationInfo = await getPeriodUserInfo({
			targetDate: addDays(periodData.startDate, 2),
			userId
		});

		if (!confirmationInfo?.snackInfo) {
			logging.info('No Confirmation Info');
			return;
		}

		const snackInfo = confirmationInfo.snackInfo.find(
			(currentSnack) => currentSnack.id === snackId
		);

		if (!snackInfo) {
			logging.info('No Snack Info');
			return;
		}

		if (snackInfo.disabled) {
			logging.info('Snack Disabled');
			return;
		}

		if (!snackInfo.canAdd) {
			logging.info('Cannot Add To Chosen Period');
			return;
		}

		const userOrderConfigFound = await db.query.userOrderConfig.findFirst({
			where: eq(userOrderConfig.userId, userId)
		});

		if (!userOrderConfigFound) {
			logging.info('No User Order Config');
			return;
		}

		await db.insert(orderLine).values({
			id: nanoid(),
			weekId: periodId,
			snackId,
			userOrderConfigId: userOrderConfigFound.id,
			quantity: 1
		});
	},

	removeSnack: async ({ request, locals }) => {
		const authUser = await locals.user;

		if (!authUser) {
			logging.info('No Auth User');
			return;
		}

		const form = await request.formData();
		const id = form.get('id')?.toString();

		if (!id) {
			logging.info('No ID');
			return;
		}

		const orderLineFound = await db.query.orderLine.findFirst({
			where: eq(orderLine.id, id),
			with: { userOrderConfig: true, week: true }
		});

		if (!orderLineFound) {
			logging.info('No Order Line Found');
			return;
		}

		if (!orderLineFound.week) {
			logging.info('No Week Found');
			return;
		}

		if (orderLineFound.userOrderConfig.userId !== authUser.userId) {
			logging.info('Order Line Not For User');
			return;
		}

		const dateInformation = await generateDateInformation({
			targetDate: addDays(orderLineFound.week.startDate, 3),
			daysToAllowOrdering: serverEnv.DAYS_TO_ALLOW_ORDERING,
			frequency: serverEnv.FREQUENCY,
			orderLead: serverEnv.ORDER_LEAD,
			startDay: serverEnv.START_DAY,
			nowDate: new Date()
		});

		if (!dateInformation.canOrder) {
			logging.info('Ordering Closed For The Week');
			return;
		}

		await db.delete(orderLine).where(eq(orderLine.id, id));

		return;
	}
};
