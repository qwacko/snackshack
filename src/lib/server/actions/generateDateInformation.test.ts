import { describe, it, expect } from 'vitest';
import { generateDateInformation } from './generateDateInformation';

describe('Date Generation', () => {
	it('Now Date = Saturday, Target Date = Saturday, Week = Sunday, Order = Sunday', async () => {
		const dateString = '2023-09-02T10:00:00.000Z';

		const data = await generateDateInformation({
			targetDate: new Date(dateString),
			firstDayOfWeek: 0,
			orderDay: 0,
			nowDate: new Date(dateString)
		});
		expect(data.daysToEndOfOrdering).toBe(8);
	});
	it('Now Date = Saturday, Target Date = Saturday, Week = Wednesday, Order = Sunday', async () => {
		const dateString = '2023-09-02T10:00:00.000Z';

		const data = await generateDateInformation({
			targetDate: new Date(dateString),
			firstDayOfWeek: 3,
			orderDay: 0,
			nowDate: new Date(dateString)
		});
		expect(data.daysToEndOfOrdering).toBe(8);
	});
	it('Now Date = Saturday, Target Date = Saturday, Week = Saturday, Order = Wednesday', async () => {
		const dateString = '2023-09-02T10:00:00.000Z';

		const data = await generateDateInformation({
			targetDate: new Date(dateString),
			firstDayOfWeek: 6,
			orderDay: 3,
			nowDate: new Date(dateString)
		});
		expect(data.daysToEndOfOrdering).toBe(11);
	});
	it('Now Date = Saturday + 1 week, Target Date = Saturday, Week = Sunday, Order = Sunday', async () => {
		const dateString = '2023-09-02T10:00:00.000Z';

		const data = await generateDateInformation({
			targetDate: new Date(dateString),
			firstDayOfWeek: 0,
			orderDay: 0,
			nowDate: new Date('2023-09-09T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(1);
	});
});
