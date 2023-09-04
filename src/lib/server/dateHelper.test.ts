import { describe, it, expect } from 'vitest';
import { dateHelper } from './dateHelper';

describe('Date Range Generator (dateHelper)', () => {
	it('Test 01 : Frequency Is Weekly and Current Date Is In The Week', async () => {
		const data = dateHelper({
			inputDate: new Date('2023-09-09T10:00:00.000Z'),
			frequency: 'WEEKLY',
			startDay: 0
		});

		expect(data.startDate).toEqual(new Date('2023-09-03T00:00:00.000Z'));
		expect(data.endDate).toEqual(new Date('2023-09-10T00:00:00.000Z'));
	});
	it('Test 02 : Frequency Is Weekly and Current Date Is Start Of Week', async () => {
		const data = dateHelper({
			inputDate: new Date('2023-09-04T10:00:00.000Z'),
			frequency: 'WEEKLY',
			startDay: 1
		});

		expect(data.startDate).toEqual(new Date('2023-09-04T00:00:00.000Z'));
		expect(data.endDate).toEqual(new Date('2023-09-11T00:00:00.000Z'));
	});
	it('Test 03 : Frequency Is Monthly and Current Date Is Start Of Month', async () => {
		const data = dateHelper({
			inputDate: new Date('2023-09-04T10:00:00.000Z'),
			frequency: 'MONTHLY',
			startDay: 4
		});

		expect(data.startDate).toEqual(new Date('2023-09-04T00:00:00.000Z'));
		expect(data.endDate).toEqual(new Date('2023-10-04T00:00:00.000Z'));
	});
	it('Test 04 : Frequency Is Monthly and Current Date Is In The Month', async () => {
		const data = dateHelper({
			inputDate: new Date('2023-09-12T10:00:00.000Z'),
			frequency: 'MONTHLY',
			startDay: 6
		});

		expect(data.startDate).toEqual(new Date('2023-09-06T00:00:00.000Z'));
		expect(data.endDate).toEqual(new Date('2023-10-06T00:00:00.000Z'));
	});
	it('Test 04 : Frequency Is Monthly and The Month Spans A New Year', async () => {
		const data = dateHelper({
			inputDate: new Date('2023-12-12T10:00:00.000Z'),
			frequency: 'MONTHLY',
			startDay: 6
		});

		expect(data.startDate).toEqual(new Date('2023-12-06T00:00:00.000Z'));
		expect(data.endDate).toEqual(new Date('2024-01-06T00:00:00.000Z'));
	});
});
