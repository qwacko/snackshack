import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { dev } from '$app/environment';

const parseEnvStringToBoolean = ({
	defaultBoolean = true,
	optional = true
}: { defaultBoolean?: boolean; optional?: boolean } = {}) => {
	const validation = z.string().transform((data) => {
		return Boolean(JSON.parse(data));
	});
	const defaultString = defaultBoolean ? 'true' : 'false';

	if (optional) {
		return validation.optional().default(defaultString);
	}

	return validation.default(defaultString);
};

const daysOfWeek = {
	SUNDAY: 0,
	MONDAY: 1,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6
} as const;

const daysOfWeekList = [
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY'
] as const;

const serverEnvValidation = z.object({
	DEV: z.boolean().optional().default(false),
	LOGGING: parseEnvStringToBoolean({ defaultBoolean: true, optional: true }),
	LOGGING_CLASSES: z
		.string()
		.optional()
		.default('ERROR,WARN,INFO')
		.transform((data) => data.split(',').map((d) => d.trim().toUpperCase())),
	BACKUP_DIR: z.string().optional().default('./backup'),
	BACKUP_SCHEDULE: z.string().optional().default('0 0 * * *'),
	ALLOW_SIGNUP: parseEnvStringToBoolean({ defaultBoolean: true, optional: true }),
	DEV_OVERRIDE: parseEnvStringToBoolean({ defaultBoolean: false, optional: true }),
	CSRF_CHECK_ORIGIN: parseEnvStringToBoolean({ defaultBoolean: true, optional: true }),
	UPLOAD_LOCATION: z.string().optional().default('uploads/'),
	DATABASE_FILE: z.string().optional().default('./database.sqlite3'),
	FIRST_DAY_OF_WEEK: z
		.enum(daysOfWeekList)
		.optional()
		.default('MONDAY')
		.transform((data) => {
			return daysOfWeek[data] ? daysOfWeek[data] : 1;
		}),
	ORDER_DAY: z
		.enum(daysOfWeekList)
		.optional()
		.default('SUNDAY')
		.transform((data) => {
			return daysOfWeek[data] ? daysOfWeek[data] : 0;
		})
});

export const serverEnv = serverEnvValidation.parse({
	DEV: dev,
	LOGGING: env.LOGGING,
	LOOGGING_CLASSES: env.DEBUG_CLASSES,
	BACKUP_DIR: env.BACKUP_DIR,
	BACKUP_SCHEDULE: env.BACKUP_SCHEDULE,
	ALLOW_SIGNUP: env.ALLOW_SIGNUP,
	DEV_OVERRIDE: env.DEV_OVERRIDE,
	CSRF_CHECK_ORIGIN: env.CSRF_CHECK_ORIGIN,
	UPLOAD_LOCATION: env.UPLOAD_DIR,
	DATABASE_FILE: env.DATABASE_FILE,
	FIRST_DAY_OF_WEEK: env.FIRST_DAY_OF_WEEK,
	ORDER_DAY: env.ORDER_DAY
});
