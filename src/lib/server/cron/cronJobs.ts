import { addDays } from '$lib/addDays';
import { sql } from 'drizzle-orm';
import { backupDB, db } from '../db/db';
import { logging } from '../logging';
import { serverEnv } from '../serverEnv';
import type { CronJob } from './cron';
import { orderingPeriod } from '../db/schema';
import { createPeriod } from '../actions/createOrderingPeriod';

export const cronJobs: CronJob[] = [
	{
		name: 'Backup SQLite Database',
		schedule: serverEnv.BACKUP_SCHEDULE,
		job: async () => {
			await backupDB('Scheduled Backup');
		}
	},
	{
		name: 'Generate Ordering Period',
		schedule: '* * * * *',
		job: async () => {
			const nowDate = new Date();
			const prevPeriod = addDays(nowDate, serverEnv.FREQUENCY === 'MONTHLY' ? -30 : -7);
			const nextPeriod = addDays(nowDate, serverEnv.FREQUENCY === 'MONTHLY' ? 30 : 7);

			const orderingPeriodCountStart = await db
				.select({ count: sql<number>`count(*)` })
				.from(orderingPeriod);

			await Promise.all([
				createPeriod(nowDate),
				createPeriod(prevPeriod),
				createPeriod(nextPeriod)
			]);

			const orderingPeriodCountEnd = await db
				.select({ count: sql<number>`count(*)` })
				.from(orderingPeriod);

			const orderingPeriodAddedCount =
				orderingPeriodCountEnd[0]['count'] - orderingPeriodCountStart[0]['count'];
			if (orderingPeriodAddedCount > 0) {
				logging.info(
					'CRON : Number Of Ordering Periods Added: ',
					orderingPeriodCountEnd[0]['count'] - orderingPeriodCountStart[0]['count']
				);
			}
		}
	}
];
