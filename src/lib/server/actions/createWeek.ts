import { db } from '$lib/server/db/db';
import { and, gte, lte } from 'drizzle-orm';
import { generateDateInformation } from './generateDateInformation';
import { week } from '$lib/server/db/schema';
import { nanoid } from 'nanoid';
import { logging } from '$lib/server/logging';

export const createWeek = async (date: Date) => {
	const dateInformation = await generateDateInformation(date);

	if (!dateInformation.allowWeekCreation) {
		logging.error('createWeek', 'Week creation not allowed (outside of range)');
		return;
	}

	const searchWeek = await db.query.week.findFirst({
		where: and(
			lte(week.startDate, dateInformation.midWeek),
			gte(week.endDate, dateInformation.midWeek)
		)
	});

	if (searchWeek) {
		logging.error('createWeek', 'Week already exists');
		return;
	}

	await db
		.insert(week)
		.values({
			id: nanoid(),
			startDate: dateInformation.startDate,
			endDate: dateInformation.endDate
		})
		.execute();
};
