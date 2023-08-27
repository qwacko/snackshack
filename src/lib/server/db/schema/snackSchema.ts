import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { user } from './userSchema';

export const snackGroup = sqliteTable('snack_group', {
	id: text('id').primaryKey(),
	title: text('title').unique().notNull(),
	limit: integer('limit')
});

export const snack = sqliteTable(
	'snack',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull().unique(),
		snackGroupId: text('snack_group_id')
			.notNull()
			.references(() => snackGroup.id, { onDelete: 'cascade' }),
		priceCents: integer('priceCents').notNull(),
		maxQuantity: integer('max_quantity'),
		overrideGroupLimit: integer('override_group_limit', { mode: 'boolean' })
			.notNull()
			.default(false),
		imageFilename: text('image_filename'),
		salePercentage: integer('sale_percentage').notNull().default(0),
		salePrice: integer('sale_price').notNull(),
		availablePercentage: integer('availablePercentage').notNull().default(100),
		enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true)
	},
	(table) => ({
		snackGroupIdx: index('snack_group_idx').on(table.snackGroupId)
	})
);

export const week = sqliteTable('week', {
	id: text('id').primaryKey(),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull()
});

export const weekOptions = sqliteTable(
	'week_options',
	{
		id: text('id').primaryKey(),
		weekId: text('week_id')
			.notNull()
			.references(() => week.id, { onDelete: 'cascade' }),
		snackId: text('snack_id')
			.notNull()
			.references(() => snack.id, { onDelete: 'cascade' }),
		priceCents: integer('priceCents').notNull(),
		special: integer('special', { mode: 'boolean' }).notNull().default(false)
	},
	(table) => ({
		weekIdx: index('option_week_idx').on(table.weekId),
		snackIdx: index('option_snack_idx').on(table.snackId)
	})
);

export const orderLine = sqliteTable(
	'order_line',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		weekId: text('week_id')
			.notNull()
			.references(() => week.id, { onDelete: 'cascade' }),
		snackId: text('snack_id')
			.notNull()
			.references(() => weekOptions.id, { onDelete: 'cascade' }),
		quantity: integer('quantity').notNull().default(1),
		submitted: integer('submitted', { mode: 'boolean' }).notNull().default(false),
		purchased: integer('purchased', { mode: 'boolean' }).notNull().default(false)
	},
	(table) => ({
		weekIdx: index('order_week_idx').on(table.weekId),
		snackIdx: index('order_snack_idx').on(table.snackId),
		userIdx: index('order_user_idx').on(table.userId)
	})
);
