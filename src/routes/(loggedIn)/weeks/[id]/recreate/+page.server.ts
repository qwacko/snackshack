import { addDays } from '$lib/addDays.js';
import { createWeek } from '$lib/server/actions/createWeek';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation.js';
import { useCombinedAuthGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';
import { orderLine, week, weekOptions } from '$lib/server/db/schema';
import { logging } from '$lib/server/logging';
import { serverEnv } from '$lib/server/serverEnv';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, route, params }) => {
	useCombinedAuthGuard({ locals, route });

	const weekInfo = await db.query.week.findFirst({
		where: eq(week.id, params.id),
		with: { options: true, orders: true }
	});

	if (!weekInfo) {
		logging.info('recreateWeek Load', 'No week found');
		throw redirect(302, '/weeks');
	}

	const optionCount = weekInfo.options.length;
	const orderCount = weekInfo.orders.length;
	const startDate = weekInfo.startDate;
	const endDate = weekInfo.endDate;

	const dateInformation = await generateDateInformation({
		targetDate: startDate,
		firstDayOfWeek: serverEnv.FIRST_DAY_OF_WEEK,
		nowDate: new Date(),
		orderDay: serverEnv.ORDER_DAY
	});

	if (!dateInformation.allowWeekCreation) {
		logging.info('recreateWeek Load', 'Week is not allowed to be recreated');
		throw redirect(302, '/weeks');
	}

	return {
		optionCount,
		orderCount,
		startDate,
		endDate
	};
};

export const actions = {
	recreateWeek: async ({ params }) => {
		const targetWeek = await db.query.week.findFirst({
			where: eq(week.id, params.id)
		});

		if (!targetWeek) {
			logging.error('recreateWeek Action', 'No week found');
			return;
		}

		db.delete(orderLine).where(eq(orderLine.weekId, targetWeek.id)).run();
		db.delete(weekOptions).where(eq(weekOptions.weekId, targetWeek.id)).run();
		db.delete(week).where(eq(week.id, targetWeek.id)).run();

		await createWeek(addDays(targetWeek.startDate, 2));

		throw redirect(302, `/weeks?date=${targetWeek.startDate.toISOString().slice(0, 10)}`);
	}
};
