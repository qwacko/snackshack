import { z } from 'zod';

export const updateNameSchema = z.object({
	name: z.string().min(3)
});

export type updateNameSchemaType = typeof updateNameSchema;
