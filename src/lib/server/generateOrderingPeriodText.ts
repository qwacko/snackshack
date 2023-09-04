import { serverEnv, type SERVER_ENV_TYPE } from './serverEnv';

export const generateOrderingPeriodText = (period: SERVER_ENV_TYPE['FREQUENCY']) =>
	period === 'MONTHLY'
		? { plural: 'Months', pluralLower: 'months', single: 'Month', singleLower: 'month' }
		: { plural: 'Weeks', pluralLower: 'weels', single: 'Week', singleLower: 'week' };

export const orderingPeriodText = generateOrderingPeriodText(serverEnv.FREQUENCY);
