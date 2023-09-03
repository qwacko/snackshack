import { addDays } from '$lib/addDays';
import { sql } from 'drizzle-orm';
import { backupDB, db } from '../db/db';
import { logging } from '../logging';
import { serverEnv } from '../serverEnv';
import type { CronJob } from './cron';
import { week } from '../db/schema';
import { createPeriod } from '../actions/createWeek';

export const cronJobs: CronJob[] = [
	{
		name: 'Backup SQLite Database',
		schedule: serverEnv.BACKUP_SCHEDULE,
		job: async () => {
			await backupDB('Scheduled Backup');
		}
	},
	{
		name: 'Generate Week',
		schedule: '* * * * *',
		job: async () => {
			const nowDate = new Date();
			const prevWeek = addDays(nowDate, -7);
			const nextWeek = addDays(nowDate, 7);

			const weekCountStart = await db.select({ count: sql<number>`count(*)` }).from(week);

			await Promise.all([createPeriod(nowDate), createPeriod(prevWeek), createPeriod(nextWeek)]);

			const weekCountEnd = await db.select({ count: sql<number>`count(*)` }).from(week);

			const weekAddedCount = weekCountEnd[0]['count'] - weekCountStart[0]['count'];
			if (weekAddedCount > 0) {
				logging.info(
					'CRON : Number Of Weeks Added: ',
					weekCountEnd[0]['count'] - weekCountStart[0]['count']
				);
			}
		}
	}
];
