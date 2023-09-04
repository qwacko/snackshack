import { addDays } from '$lib/addDays.js';
import { createPeriod } from '$lib/server/actions/createOrderingPeriod';
import { generateDateInformation } from '$lib/server/actions/generateDateInformation';
import { useCombinedAuthGuard } from '$lib/server/authGuard';
import { db } from '$lib/server/db/db';
import { orderLine, orderingPeriod, orderingPeriodOptions } from '$lib/server/db/schema';
import { orderingPeriodText } from '$lib/server/generateOrderingPeriodText.js';
import { logging } from '$lib/server/logging';
import { serverEnv } from '$lib/server/serverEnv';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ locals, route, params }) => {
	useCombinedAuthGuard({ locals, route });

	const orderingPeriodInfo = await db.query.orderingPeriod.findFirst({
		where: eq(orderingPeriod.id, params.id),
		with: { options: true, orders: true }
	});

	if (!orderingPeriodInfo) {
		logging.info('recreateOrderingPeriod Load', 'No Ordering Period found');
		throw redirect(302, '/orderingPeriods');
	}

	const optionCount = orderingPeriodInfo.options.length;
	const orderCount = orderingPeriodInfo.orders.length;
	const startDate = orderingPeriodInfo.startDate;
	const endDate = orderingPeriodInfo.endDate;

	const dateInformation = await generateDateInformation({
		targetDate: startDate,
		frequency: serverEnv.FREQUENCY,
		startDay: serverEnv.START_DAY,
		orderLead: serverEnv.ORDER_LEAD,
		daysToAllowOrdering: serverEnv.DAYS_TO_ALLOW_ORDERING,
		nowDate: new Date()
	});

	if (!dateInformation.allowOrderingPeriodCreation) {
		logging.info('recreateOrderingPeriod Load', 'Ordering Period is not allowed to be recreated');
		throw redirect(302, '/orderingPeriods');
	}

	return {
		optionCount,
		orderCount,
		startDate,
		endDate
	};
};

export const actions = {
	recreateOrderingPeriod: async ({ params }) => {
		const targetOrderingPeriod = await db.query.orderingPeriod.findFirst({
			where: eq(orderingPeriod.id, params.id)
		});

		if (!targetOrderingPeriod) {
			logging.error('recreateOrderingPeriod Action', `No ${orderingPeriodText.singleLower}  found`);
			return;
		}

		db.delete(orderLine).where(eq(orderLine.orderingPeriodId, targetOrderingPeriod.id)).run();
		db.delete(orderingPeriodOptions)
			.where(eq(orderingPeriodOptions.orderingPeriodId, targetOrderingPeriod.id))
			.run();
		db.delete(orderingPeriod).where(eq(orderingPeriod.id, targetOrderingPeriod.id)).run();

		await createPeriod(addDays(targetOrderingPeriod.startDate, 2));

		throw redirect(
			302,
			`/ordreingPeriods?date=${targetOrderingPeriod.startDate.toISOString().slice(0, 10)}`
		);
	}
};
