export const addDays = (date: Date, days: number) => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

const firstDayOfWeek = 3;

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
