import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { user } from './userSchema';
import { relations } from 'drizzle-orm';

export const userOrderConfig = sqliteTable(
	'user_order_config',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.unique()
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		amount: integer('amount').notNull().default(0),
		enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true)
	},
	(table) => ({
		userIdx: index('user_order_config_user_idx').on(table.userId)
	})
);

export const userOrderConfigRelations = relations(userOrderConfig, ({ one }) => ({
	user: one(user, { fields: [userOrderConfig.userId], references: [user.id] })
}));

export const snackGroup = sqliteTable('snack_group', {
	id: text('id').primaryKey(),
	title: text('title').unique().notNull(),
	limit: integer('limit')
});

export const snackGroupRelations = relations(snackGroup, ({ many }) => ({
	snacks: many(snack)
}));

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

export const snackRelations = relations(snack, ({ one, many }) => ({
	snackGroup: one(snackGroup, { fields: [snack.snackGroupId], references: [snackGroup.id] }),
	orders: many(orderLine),
	weekOptions: many(weekOptions)
}));

export const week = sqliteTable('week', {
	id: text('id').primaryKey(),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull()
});

export const weekRelations = relations(week, ({ many }) => ({
	options: many(weekOptions),
	orders: many(orderLine)
}));

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

export const weekOptionsRelations = relations(weekOptions, ({ one, many }) => ({
	week: one(week, { fields: [weekOptions.weekId], references: [week.id] }),
	snack: one(snack, { fields: [weekOptions.snackId], references: [snack.id] }),
	orders: many(orderLine)
}));

export const orderLine = sqliteTable(
	'order_line',
	{
		id: text('id').primaryKey(),
		userOrderConfigId: text('user_order_config_id')
			.notNull()
			.references(() => userOrderConfig.id),
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
		userIdx: index('order_user_idx').on(table.userOrderConfigId)
	})
);

export const orderLineRelations = relations(orderLine, ({ one }) => ({
	userOrderConfig: one(userOrderConfig, {
		fields: [orderLine.userOrderConfigId],
		references: [userOrderConfig.id]
	}),
	week: one(week, { fields: [orderLine.weekId], references: [week.id] }),
	snack: one(weekOptions, { fields: [orderLine.snackId], references: [weekOptions.id] })
}));
