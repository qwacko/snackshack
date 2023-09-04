import { orderingPeriodSchema } from '$lib/schema/paramsOrderingPeriodSchema';
import { db } from '$lib/server/db/db.js';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { and, gte, lte, notInArray } from 'drizzle-orm';
import { snack, orderingPeriod } from '$lib/server/db/schema/snackSchema';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation.js';
import { createPeriod } from '$lib/server/actions/createOrderingPeriod';
import { logging } from '$lib/server/logging.js';
import { useCombinedAuthGuard } from '$lib/server/authGuard.js';
import { serverEnv } from '$lib/server/serverEnv.js';

export const load = async ({ locals, route, url }) => {
	useCombinedAuthGuard({ locals, route });

	const processedParams = validateSearchParams(url, orderingPeriodSchema.passthrough().parse);

	const data = processedParams;

	const targetDate = new Date(data.date);
	const targetOrderingPeriodInfo = await generateDateInformation({
		targetDate: targetDate,
		frequency: serverEnv.FREQUENCY,
		daysToAllowOrdering: serverEnv.DAYS_TO_ALLOW_ORDERING,
		orderLead: serverEnv.ORDER_LEAD,
		startDay: serverEnv.START_DAY,
		nowDate: new Date(),
		log: false
	});

	const orderingPeriodData = await db.query.orderingPeriod.findFirst({
		where: and(
			lte(orderingPeriod.startDate, targetOrderingPeriodInfo.midPeriod),
			gte(orderingPeriod.endDate, targetOrderingPeriodInfo.midPeriod)
		),
		with: {
			options: { with: { snack: true } },
			orders: {
				with: { snack: { with: { snack: true } }, userOrderConfig: { with: { user: true } } }
			}
		}
	});

	const usersWithOrder = orderingPeriodData
		? orderingPeriodData.orders
				.map((currentOrder) => currentOrder.userOrderConfig.user.id)
				.filter((user) => user)
				.reduce((accumulator, currentValue) => {
					if (accumulator.includes(currentValue)) {
						return accumulator;
					}

					return [...accumulator, currentValue];
				}, [] as string[])
				.map((userId) => ({
					id: userId,
					name: orderingPeriodData?.orders.find(
						(currentOrder) => currentOrder.userOrderConfig.userId === userId
					)?.userOrderConfig.user.name
				}))
		: undefined;

	const includedSnackIds = orderingPeriodData?.options.map(
		(currentOption) => currentOption.snackId
	);

	const excludedSnacks =
		includedSnackIds && includedSnackIds.length > 0
			? db.query.snack.findMany({
					where: notInArray(snack.id, includedSnackIds)
			  })
			: undefined;

	return {
		searchData: data,
		targetDate,
		targetOrderingPeriodInfo,
		orderingPeriodData,
		excludedSnacks,
		usersWithOrder
	};
};

export const actions = {
	createPeriod: async ({ request }) => {
		const form = await request.formData();
		const targetDateString = form.get('date');

		if (!targetDateString) {
			logging.error('createPeriod Action', 'No date provided');
			return;
		}

		const targetDate = new Date(targetDateString.toString());

		await createPeriod(targetDate);
	}
};
