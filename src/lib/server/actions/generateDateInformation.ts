import { startEndOfWeek } from '$lib/server/dateHelper.js';
import { addDays } from '$lib/addDays';

const differenceBetweenDates = (date1: Date, date2: Date) => {
	const diffTime = date2.getTime() - date1.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
};

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

	const orderingEnd = addDays(startDate, -daysBeforeEndToOrder);
	const daysToEndOfOrdering = differenceBetweenDates(nowDate, orderingEnd);
	const canOrder = daysToEndOfOrdering > 0 && daysToEndOfOrdering <= 14;
	const showNextWeek = endDate < addDays(nowDate, 7);
	const midWeek = addDays(startDate, 3);

	const allowWeekCreation = daysToEndOfOrdering >= 7;

	false &&
		console.log('generateDateInformation', {
			startDate,
			endDate,
			orderingEnd,
			canOrder,
			nowDate,
			daysToEndOfOrdering
		});

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
