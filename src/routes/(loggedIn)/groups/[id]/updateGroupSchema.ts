import { z } from 'zod';

export const updateGroupSchema = z.object({
	title: z.string().min(2).max(255),
	limit: z.number().int().optional()
});

export type UpdateGroupSchemaType = typeof updateGroupSchema;
