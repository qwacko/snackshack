import { addDays } from '../addDays';

export const startEndOfWeek = (inputDate: Date, firstDayOfWeek: number) => {
	const day = new Date(inputDate).getDay();
	const offset = day >= firstDayOfWeek ? day - firstDayOfWeek : day + 7 - firstDayOfWeek;
	const diff = new Date(inputDate).getDate() - offset; // adjust when day is sunday
	const startDate = new Date(inputDate);
	startDate.setDate(diff);
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);
	const endDate = addDays(new Date(startDate), 7);

	return { startDate, endDate };
};
