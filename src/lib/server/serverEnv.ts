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

const serverEnvValidation = z
	.object({
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
		FREQUENCY: z.enum(['WEEKLY', 'MONTHLY']).optional().default('WEEKLY'),
		START_DAY: z.coerce.number().nonnegative().optional().default(0),
		ORDER_LEAD: z.coerce.number().nonnegative().optional().default(0),
		DAYS_TO_ALLOW_ORDERING: z.coerce.number().nonnegative().optional().default(7)
	})
	.refine(
		(data) => (data.FREQUENCY === 'WEEKLY' ? data.START_DAY >= 0 && data.START_DAY <= 6 : true),
		{ message: `START_DAY must be between 0 and 6 when FREQUENCY is WEEKLY`, path: ['START_DAY'] }
	)
	.refine(
		(data) => (data.FREQUENCY === 'MONTHLY' ? data.START_DAY >= 1 && data.START_DAY <= 28 : true),
		{ message: `START_DAY must be between 1 and 28 when FREQUENCY is MONTHLY`, path: ['START_DAY'] }
	);

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
	FREQUENCY: env.FREQUENCY,
	START_DATE: env.START_DAY,
	ORDER_LEAD: env.ORDER_LEAD,
	DAYS_TO_ALLOW_ORDERING: env.DAYS_TO_ALLOW_ORDERING
});

export type SERVER_ENV_TYPE = z.infer<typeof serverEnvValidation>;
