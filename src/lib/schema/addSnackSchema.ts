import { z } from 'zod';

export const addSnackSchema = z.object({
	title: z.string().min(2).max(255),
	snackGroupId: z.string(),
	priceCents: z.number().int(),
	maxQuantity: z.number().int().optional(),
	overrideGroupLimit: z.boolean().optional(),
	imageFilename: z.string().optional(),
	salePercentage: z.number().int().optional().default(50),
	salePrice: z.number().int(),
	availablePercentage: z.number().int().optional().default(100),
	enabled: z.boolean().optional().default(true)
});

export type AddSnackSchemaType = typeof addSnackSchema;
