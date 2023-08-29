import { weeksSchema } from '$lib/schema/paramsWeeksSchema';
import { db } from '$lib/server/db/db.js';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { and, gte, lte } from 'drizzle-orm';
import { week } from '$lib/server/db/schema/snackSchema.js';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation.js';
import { createWeek } from '../../../lib/server/actions/createWeek.js';
import { logging } from '$lib/server/logging.js';

export const load = async ({ url }) => {
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
			orders: { with: { snack: true, userOrderConfig: { with: { user: true } } } }
		}
	});

	return {
		searchData: data,
		targetDate,
		targetWeekInfo,
		weekData
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
