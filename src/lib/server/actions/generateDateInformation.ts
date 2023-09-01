import { startEndOfWeek } from '$lib/server/dateHelper.js';
import { addDays } from '$lib/addDays';

export const generateDateInformation = async ({
	targetDate,
	nowDate,
	orderDay,
	firstDayOfWeek
}: {
	targetDate: Date;
	nowDate: Date;
	orderDay: number;
	firstDayOfWeek: number;
}) => {
	const daysBeforeEndToOrder =
		orderDay <= firstDayOfWeek ? firstDayOfWeek - orderDay : 7 - (orderDay - firstDayOfWeek);

	const { endDate, startDate } = startEndOfWeek(targetDate, firstDayOfWeek);
	const isThisWeek = nowDate < endDate && nowDate >= startDate;
	const isNextWeek = nowDate < addDays(endDate, -7) && nowDate >= addDays(startDate, -7);
	const orderingStart = addDays(startDate, -daysBeforeEndToOrder + 7);
	const orderingEnd = addDays(endDate, -daysBeforeEndToOrder + 7);
	const canOrder = nowDate < orderingEnd && nowDate >= orderingStart;
	const daysToEndOfOrdering = orderingEnd.getDate() - nowDate.getDate();
	const showNextWeek = endDate < addDays(nowDate, 7);
	const midWeek = addDays(startDate, 3);

	const allowWeekCreation = daysToEndOfOrdering >= 7;

	return {
		startDate,
		endDate,
		isThisWeek,
		isNextWeek,
		canOrder,
		showNextWeek,
		midWeek,
		daysToEndOfOrdering,
		allowWeekCreation
	};
};
