import { addDays } from '$lib/dateHelper.js';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation.js';
import { db } from '$lib/server/db/db.js';
import { orderLine, userOrderConfig, week } from '$lib/server/db/schema/snackSchema.js';
import { user } from '$lib/server/db/schema/userSchema';
import { logging } from '$lib/server/logging.js';
import { eq, and, lte, gte } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const getWeekUserInfo = async ({ targetDate, userId }: { targetDate: Date; userId: string }) => {
	const userInformation = await db.query.user.findFirst({
		where: eq(user.id, userId),
		with: {
			userOrderConfig: true
		}
	});

	if (!userInformation?.userOrderConfig?.enabled) {
		return;
	}

	const userSpend = userInformation?.userOrderConfig.amount;

	const dateInformation = await generateDateInformation(targetDate);
	const userOrderRow = await db.query.userOrderConfig.findFirst({
		where: eq(userOrderConfig.userId, userId)
	});

	if (!userOrderRow) {
		logging.info('No User Order Config');
		return;
	}

	const weekInformation = await db.query.week.findFirst({
		where: and(
			lte(week.startDate, dateInformation.midWeek),
			gte(week.endDate, dateInformation.midWeek)
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

	if (!weekInformation) {
		return;
	}

	const totalSpent = weekInformation?.orders.reduce((accumulator, currentValue) => {
		return accumulator + currentValue.snack.priceCents;
	}, 0);

	const remainingSpend = userSpend - totalSpent;

	const groupInfo = weekInformation.options.reduce<
		{ id: string; title: string; limit: number | null; orderCount: number; limitReached: boolean }[]
	>((accumulator, currentValue) => {
		const existingIds = accumulator.map((currentGroup) => currentGroup.id);
		if (existingIds.includes(currentValue.snack.snackGroup.id)) {
			return accumulator;
		}

		const orderCount = weekInformation.orders.filter(
			(current) => current.snack.snack.snackGroup.id === currentValue.snack.snackGroup.id
		).length;

		const limitReached = Boolean(
			currentValue.snack.snackGroup.limit && orderCount >= currentValue.snack.snackGroup.limit
		);

		return [...accumulator, { ...currentValue.snack.snackGroup, orderCount, limitReached }];
	}, []);

	const snackInfo = weekInformation.options.map((currentOption) => {
		const orderCount = weekInformation.orders.filter(
			(current) => current.snack.snack.id === currentOption.snack.id
		).length;

		const group = groupInfo.find(
			(currentGroup) => currentGroup.id === currentOption.snack.snackGroup.id
		);

		if (!group) {
			throw new Error('No Group Found');
		}

		const disabled = Boolean(
			group.limitReached ||
				(currentOption.snack.maxQuantity && orderCount >= currentOption.snack.maxQuantity) ||
				currentOption.priceCents > remainingSpend
		);

		return {
			id: currentOption.id,
			title: currentOption.snack.title,
			priceCents: currentOption.priceCents,
			special: currentOption.special,
			normalPrice: currentOption.snack.priceCents,
			orderCount,
			group: group.title,
			groupId: group.id,
			disabled,
			imageFilename: currentOption.snack.imageFilename,
			limit: currentOption.snack.maxQuantity
		};
	});

	const spendingInfo = {
		totalSpent,
		remainingSpend: userSpend - totalSpent,
		userSpend
	};

	const currentOrderItems = weekInformation.orders.map((currentOrder) => {
		return {
			id: currentOrder.id,
			snackId: currentOrder.snack.id,
			snackTitle: currentOrder.snack.snack.title,
			snackPrice: currentOrder.snack.priceCents,
			snackSpecial: currentOrder.snack.special,
			snackImageFilename: currentOrder.snack.snack.imageFilename
		};
	});

	return {
		dateInformation,
		spendingInfo,
		snackInfo,
		groupInfo,
		weekId: weekInformation.id,
		currentOrderItems
	};
};

export const load = async ({ locals }) => {
	if (!locals.user) {
		logging.info('No Logged In User');
		return;
	}

	return {
		orderingInfo: getWeekUserInfo({ targetDate: new Date(), userId: locals.user.userId })
	};
};

export const actions = {
	addSnack: async ({ request, locals }) => {
		logging.info('Adding Snack');

		const form = await request.formData();
		const snackId = form.get('snackId')?.toString();
		const weekId = form.get('weekId')?.toString();
		const userId = form.get('userId')?.toString();

		if (!snackId || !weekId || !userId) {
			logging.info('Missing Form Information', { snackId, weekId, userId });
			return;
		}

		const authUser = locals.user;

		if (!authUser || authUser.userId !== userId) {
			logging.info('User Not Logged In', { userId, authUser });
			return;
		}

		const weekData = await db.query.week.findFirst({
			where: eq(week.id, weekId)
		});

		if (!weekData) {
			logging.info('No Week Data', { weekId });
			return;
		}

		const confirmationInfo = await getWeekUserInfo({
			targetDate: addDays(weekData.startDate, 2),
			userId
		});

		if (!confirmationInfo) {
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

		const userOrderConfigFound = await db.query.userOrderConfig.findFirst({
			where: eq(userOrderConfig.userId, userId)
		});

		if (!userOrderConfigFound) {
			logging.info('No User Order Config');
			return;
		}

		await db.insert(orderLine).values({
			id: nanoid(),
			weekId,
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
			with: { userOrderConfig: true }
		});

		if (!orderLineFound) {
			logging.info('No Order Line Found');
			return;
		}

		if (orderLineFound.userOrderConfig.userId !== authUser.userId) {
			logging.info('Order Line Not For User');
			return;
		}

		await db.delete(orderLine).where(eq(orderLine.id, id));

		return;
	}
};
