import { db } from '$lib/server/db/db';
import { and, gte, lte, eq, gt } from 'drizzle-orm';
import { generateDateInformation } from './generateDateInformation';
import { snack, week, weekOptions } from '$lib/server/db/schema';
import { nanoid } from 'nanoid';
import { logging } from '$lib/server/logging';
import { serverEnv } from '../serverEnv';

export const populateWeek = async ({ weekId, transDB }: { weekId: string; transDB: typeof db }) => {
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

export const createWeek = async (date: Date, logErrors: boolean = false) => {
	const dateInformation = await generateDateInformation({
		targetDate: date,
		firstDayOfWeek: serverEnv.FIRST_DAY_OF_WEEK,
		nowDate: new Date(),
		orderDay: serverEnv.ORDER_DAY
	});

	if (!dateInformation.allowWeekCreation) {
		logErrors && logging.error('createWeek', 'Week creation not allowed (outside of range)');
		return;
	}

	const searchWeek = await db.query.week.findFirst({
		where: and(
			lte(week.startDate, dateInformation.midWeek),
			gte(week.endDate, dateInformation.midWeek)
		)
	});

	if (searchWeek) {
		logErrors && logging.error('createWeek', 'Week already exists');
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
				lte(week.startDate, dateInformation.midWeek),
				gte(week.endDate, dateInformation.midWeek)
			)
		});

		if (!createdWeek) {
			dbTrans.rollback();
			return;
		}

		await populateWeek({ weekId: createdWeek.id, transDB: dbTrans });

		logging.info('New Week Created', createdWeek);
	});
};
