import { weeksSchema } from '$lib/schema/paramsWeeksSchema';
import { db } from '$lib/server/db/db.js';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { and, gte, lte, notInArray } from 'drizzle-orm';
import { snack, week } from '$lib/server/db/schema/snackSchema.js';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation.js';
import { createWeek } from '$lib/server/actions/createWeek.js';
import { logging } from '$lib/server/logging.js';
import { useCombinedAuthGuard } from '$lib/server/authGuard.js';

export const load = async ({ locals, route, url }) => {
	useCombinedAuthGuard({ locals, route });

	const processedParams = validateSearchParams(url, weeksSchema.passthrough().parse);

	const data = processedParams;

	const targetDate = new Date(data.date);
	const targetWeekInfo = await generateDateInformation(targetDate);

	const weekData = await db.query.week.findFirst({
		where: and(
			lte(week.startDate, targetWeekInfo.midWeek),
			gte(week.endDate, targetWeekInfo.midWeek)
		),
		with: {
			options: { with: { snack: true } },
			orders: {
				with: { snack: { with: { snack: true } }, userOrderConfig: { with: { user: true } } }
			}
		}
	});

	const usersWithOrder = weekData
		? weekData.orders
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
					name: weekData?.orders.find(
						(currentOrder) => currentOrder.userOrderConfig.userId === userId
					)?.userOrderConfig.user.name
				}))
		: undefined;

	const includedSnackIds = weekData?.options.map((currentOption) => currentOption.snackId);

	const excludedSnacks =
		includedSnackIds && includedSnackIds.length > 0
			? db.query.snack.findMany({
					where: notInArray(snack.id, includedSnackIds)
			  })
			: undefined;

	return {
		searchData: data,
		targetDate,
		targetWeekInfo,
		weekData,
		excludedSnacks,
		usersWithOrder
	};
};

export const actions = {
	createWeek: async ({ request }) => {
		const form = await request.formData();
		const targetDateString = form.get('date');

		if (!targetDateString) {
			logging.error('createWeek Action', 'No date provided');
			return;
		}

		const targetDate = new Date(targetDateString.toString());

		await createWeek(targetDate);
	}
};
