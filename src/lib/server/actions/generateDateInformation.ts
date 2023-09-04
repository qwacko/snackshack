import { dateHelper } from '$lib/server/dateHelper.js';
import { addDays } from '$lib/addDays';
import type { SERVER_ENV_TYPE } from '../serverEnv';

const differenceBetweenDates = (date1: Date, date2: Date) => {
	const diffTime = date2.getTime() - date1.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
};

export const generateDateInformation = async ({
	frequency,
	targetDate,
	startDay,
	orderLead,
	daysToAllowOrdering,
	nowDate,
	log = false
}: {
	targetDate: Date;
	nowDate: Date;
	frequency: SERVER_ENV_TYPE['FREQUENCY'];
	startDay: SERVER_ENV_TYPE['START_DAY'];
	orderLead: SERVER_ENV_TYPE['ORDER_LEAD'];
	daysToAllowOrdering: SERVER_ENV_TYPE['DAYS_TO_ALLOW_ORDERING'];
	log?: boolean;
}) => {
	const { endDate, startDate } = dateHelper({
		frequency,
		startDay,
		inputDate: targetDate
	});
	const isCurrent = nowDate < endDate && nowDate >= startDate;
	const orderingEnd = addDays(startDate, -orderLead);
	const daysToEndOfOrdering = differenceBetweenDates(nowDate, orderingEnd);

	const canOrder = daysToEndOfOrdering > 0 && daysToEndOfOrdering <= daysToAllowOrdering;
	const midPeriod = addDays(new Date(startDate), frequency === 'MONTHLY' ? 15 : 3);

	const nextPeriodMid = addDays(midPeriod, frequency === 'MONTHLY' ? 30 : 7);
	const prevPeriodMid = addDays(midPeriod, frequency === 'MONTHLY' ? -30 : -7);

	const allowOrderingPeriodCreation = canOrder;

	const daysToEndOfNextOrdering = differenceBetweenDates(nowDate, addDays(endDate, -orderLead));
	const showNextPeriod = daysToEndOfNextOrdering < daysToAllowOrdering;

	log &&
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
		isCurrent,
		canOrder,
		midPeriod,
		daysToEndOfOrdering,
		allowOrderingPeriodCreation,
		nextPeriodMid,
		prevPeriodMid,
		showNextPeriod
	};
};
