import { describe, it, expect } from 'vitest';
import { generateDateInformation } from './generateDateInformation';

describe('Date Generation', () => {
	it('Test 01 : Week Start and Order Day are the same (and tomorrow)', async () => {
		const data = await generateDateInformation({
			targetDate: new Date('2023-09-09T10:00:00.000Z'),
			frequency: 'WEEKLY',
			startDay: 0,
			orderLead: 0,
			daysToAllowOrdering: 14,
			nowDate: new Date('2023-09-02T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(1);
		expect(data.canOrder).toBe(true);
	});
	it('Test 02 : Week Start and Order Day are different. Order Day is tomorrow', async () => {
		const data = await generateDateInformation({
			targetDate: new Date('2023-09-09T10:00:00.000Z'),
			frequency: 'WEEKLY',
			startDay: 0,
			orderLead: 0,
			daysToAllowOrdering: 14,
			nowDate: new Date('2023-09-02T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(1);
		expect(data.canOrder).toBe(true);
	});
	it('Test 03 : Current day is week start, and order day is different. Should be in the past', async () => {
		const data = await generateDateInformation({
			targetDate: new Date('2023-09-09T10:00:00.000Z'),
			frequency: 'WEEKLY',
			daysToAllowOrdering: 14,
			orderLead: 3,
			startDay: 6,
			nowDate: new Date('2023-09-09T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(-3);
		expect(data.canOrder).toBe(false);
	});
	it('Test 04 : Current day is a week from week start, and order day is different.', async () => {
		const data = await generateDateInformation({
			targetDate: new Date('2023-09-09T10:00:00.000Z'),
			frequency: 'WEEKLY',
			daysToAllowOrdering: 14,
			orderLead: 3,
			startDay: 6,
			nowDate: new Date('2023-09-02T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(4);
		expect(data.canOrder).toBe(true);
	});
	it('Test 05 : Date is start of the week, ordering date is earlier', async () => {
		const data = await generateDateInformation({
			targetDate: new Date('2023-09-09T10:00:00.000Z'),
			frequency: 'WEEKLY',
			daysToAllowOrdering: 14,
			orderLead: 0,
			startDay: 0,
			nowDate: new Date('2023-09-09T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(-6);
		expect(data.canOrder).toBe(false);
	});
	it('Test 06 : Long Time Until Ordering', async () => {
		const data = await generateDateInformation({
			targetDate: new Date('2023-09-02T10:00:00.000Z'),
			frequency: 'WEEKLY',
			daysToAllowOrdering: 14,
			orderLead: 0,
			startDay: 0,
			nowDate: new Date('2023-08-12T10:00:00.000Z')
		});
		expect(data.daysToEndOfOrdering).toBe(15);
		expect(data.canOrder).toBe(false);
	});
});
