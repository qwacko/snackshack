import { db } from '$lib/server/db/db.js';
import { startEndOfWeek } from '$lib/server/dateHelper.js';
import { addDays } from '$lib/addDays';
import { serverEnv } from '../serverEnv';

const daysBeforeEndToOrder =
	serverEnv.ORDER_DAY < serverEnv.FIRST_DAY_OF_WEEK
		? serverEnv.FIRST_DAY_OF_WEEK - serverEnv.ORDER_DAY
		: 7 - (serverEnv.ORDER_DAY - serverEnv.FIRST_DAY_OF_WEEK);

console.log('Days Before order: ', daysBeforeEndToOrder);

export const generateDateInformation = async (targetDate: Date) => {
	const nowDate = new Date();
	const { endDate, startDate } = startEndOfWeek(targetDate);
	const isThisWeek = nowDate < endDate && nowDate >= startDate;
	const isNextWeek = nowDate < addDays(endDate, -7) && nowDate >= addDays(startDate, -7);
	const orderingStart = addDays(startDate, -daysBeforeEndToOrder - 7);
	const orderingEnd = addDays(endDate, -daysBeforeEndToOrder - 7);
	const canOrder = nowDate < orderingEnd && nowDate >= orderingStart;
	const daysToEndOfOrdering = orderingEnd.getDate() - nowDate.getDate();
	const showNextWeek = endDate < addDays(nowDate, 7);
	const earliestDate = await db.query.week.findFirst({
		orderBy: (weekTable, { asc }) => [asc(weekTable.startDate)]
	});
	const allowWeekCreation = nowDate >= orderingStart;
	const showPrevWeek = earliestDate ? startDate > earliestDate.startDate : true;

	const midWeek = addDays(startDate, 3);

	console.log('Ordering Information:', {
		nowDate,
		targetDate,
		startDate,
		orderingStart,
		endDate,
		orderingEnd,
		isThisWeek,
		isNextWeek,
		canOrder,
		daysToEndOfOrdering
	});

	return {
		startDate,
		endDate,
		isThisWeek,
		isNextWeek,
		canOrder,
		showNextWeek,
		allowWeekCreation,
		showPrevWeek,
		midWeek,
		daysToEndOfOrdering
	};
};
