import { addDays } from '../addDays';
import { serverEnv } from './serverEnv';

const firstDayOfWeek = serverEnv.FIRST_DAY_OF_WEEK;

export const startEndOfWeek = (date: Date) => {
	const day = date.getDay();
	const offset = day >= firstDayOfWeek ? day - firstDayOfWeek : day + 7 - firstDayOfWeek;
	const diff = date.getDate() - offset; // adjust when day is sunday
	const startDate = new Date(date.setDate(diff));
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);

	const endDate = addDays(startDate, 7);

	return { startDate, endDate };
};
