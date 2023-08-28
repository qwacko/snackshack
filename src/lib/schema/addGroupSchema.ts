import { z } from 'zod';

export const addGroupSchema = z.object({
	title: z.string().min(2).max(255),
	limit: z.number().int().optional()
});

export type AddGroupSchemaType = typeof addGroupSchema;
