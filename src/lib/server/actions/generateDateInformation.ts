import { db } from '$lib/server/db/db.js';
import { addDays, startEndOfWeek } from '$lib/dateHelper.js';

export const generateDateInformation = async (targetDate: Date) => {
	const { endDate, startDate } = startEndOfWeek(targetDate);
	const isThisWeek = new Date() < endDate && new Date() > startDate;
	const showNextWeek = endDate < addDays(new Date(), 7);
	const earliestDate = await db.query.week.findFirst({
		orderBy: (weekTable, { asc }) => [asc(weekTable.startDate)]
	});
	const allowWeekCreation = startDate > addDays(new Date(), -14);
	const showPrevWeek = earliestDate ? startDate > earliestDate.startDate : true;

	const midWeek = addDays(startDate, 3);

	return { startDate, endDate, isThisWeek, showNextWeek, allowWeekCreation, showPrevWeek, midWeek };
};
