import { db } from '$lib/server/db/db';
import { and, gte, lte, eq, gt } from 'drizzle-orm';
import { generateDateInformation } from './generateDateInformation';
import { snack, week, weekOptions } from '$lib/server/db/schema';
import { nanoid } from 'nanoid';
import { logging } from '$lib/server/logging';
import { serverEnv } from '../serverEnv';

export const populatePeriod = async ({
	weekId,
	transDB
}: {
	weekId: string;
	transDB: typeof db;
}) => {
	const snacks = await transDB.query.snack.findMany({
		where: and(eq(snack.enabled, true), gt(snack.priceCents, 0)),
		with: { snackGroup: true }
	});

	const weekOptionsToCreate = snacks.map((currentSnack) => {
		const enable =
			currentSnack.availablePercentage > 0
				? Math.random() * 100 < currentSnack.availablePercentage
				: true;

		const onSale =
			currentSnack.salePercentage > 0 && currentSnack.salePrice > 0
				? Math.random() * 100 < currentSnack.salePercentage
				: false;

		const priceCents = onSale ? currentSnack.salePrice : currentSnack.priceCents;

		return {
			id: nanoid(),
			enable,
			weekId,
			special: onSale,
			priceCents,
			snackId: currentSnack.id
		};
	});

	await Promise.all(
		weekOptionsToCreate.map(async (currentOption) => {
			const { enable, ...optionData } = currentOption;

			if (!enable) {
				return;
			}

			await db.insert(weekOptions).values(optionData).execute();
		})
	);
};

export const createPeriod = async (date: Date, logErrors: boolean = false) => {
	const dateInformation = await generateDateInformation({
		targetDate: date,
		frequency: serverEnv.FREQUENCY,
		startDay: serverEnv.START_DAY,
		daysToAllowOrdering: serverEnv.DAYS_TO_ALLOW_ORDERING,
		orderLead: serverEnv.ORDER_LEAD,
		nowDate: new Date()
	});

	if (!dateInformation.allowWeekCreation) {
		logErrors && logging.error('createWeek', 'Week creation not allowed (outside of range)');
		return;
	}

	const searchPeriod = await db.query.week.findFirst({
		where: and(
			lte(week.startDate, dateInformation.midPeriod),
			gte(week.endDate, dateInformation.midPeriod)
		)
	});

	if (searchPeriod) {
		logErrors && logging.error('createPeriod', 'Period already exists');
		return;
	}

	db.transaction(async (dbTrans) => {
		await dbTrans
			.insert(week)
			.values({
				id: nanoid(),
				startDate: dateInformation.startDate,
				endDate: dateInformation.endDate
			})
			.execute();

		const createdWeek = await dbTrans.query.week.findFirst({
			where: and(
				lte(week.startDate, dateInformation.midPeriod),
				gte(week.endDate, dateInformation.midPeriod)
			)
		});

		if (!createdWeek) {
			dbTrans.rollback();
			return;
		}

		await populatePeriod({ weekId: createdWeek.id, transDB: dbTrans });

		logging.info('New Period Created', createdWeek);
	});
};
