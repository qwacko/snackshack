import { z } from 'zod';

export const weeksSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.default(new Date().toISOString().slice(0, 10))
});
