import { error } from '@sveltejs/kit';
import { addDays } from '../addDays';
import type { SERVER_ENV_TYPE } from './serverEnv';

export const dateHelper = ({
	inputDate,
	frequency,
	startDay
}: {
	inputDate: Date;
	frequency: SERVER_ENV_TYPE['FREQUENCY'];
	startDay: SERVER_ENV_TYPE['START_DAY'];
}) => {
	if (frequency === 'WEEKLY') {
		const day = new Date(inputDate).getDay();
		const offset = day >= startDay ? day - startDay : day + 7 - startDay;
		const diff = new Date(inputDate).getDate() - offset; // adjust when day is sunday
		const startDate = new Date(inputDate);
		startDate.setDate(diff);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		const endDate = addDays(new Date(startDate), 7);

		return { startDate, endDate };
	} else if (frequency === 'MONTHLY') {
		const startDate = new Date(inputDate);
		startDate.setDate(startDay);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1);

		return { startDate, endDate };
	}
	throw error(400, `Invalid Frequency : ${frequency}`);
};
