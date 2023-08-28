import { z } from 'zod';

export const updateUserOrderingConfigSchema = z.object({
	enabled: z.boolean().optional(),
	amount: z.number().int().optional()
});

export type UpdateUserOrderingConfigSchemaType = typeof updateUserOrderingConfigSchema;
