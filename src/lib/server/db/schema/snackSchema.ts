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
	orderingPeriodOptions: many(orderingPeriodOptions)
}));

export const orderingPeriod = sqliteTable('week', {
	id: text('id').primaryKey(),
	startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
	endDate: integer('end_date', { mode: 'timestamp' }).notNull()
});

export const orderingPeriodRelations = relations(orderingPeriod, ({ many }) => ({
	options: many(orderingPeriodOptions),
	orders: many(orderLine)
}));

export const orderingPeriodOptions = sqliteTable(
	'week_options',
	{
		id: text('id').primaryKey(),
		orderingPeriodId: text('week_id')
			.notNull()
			.references(() => orderingPeriod.id, { onDelete: 'cascade' }),
		snackId: text('snack_id')
			.notNull()
			.references(() => snack.id, { onDelete: 'cascade' }),
		priceCents: integer('priceCents').notNull(),
		special: integer('special', { mode: 'boolean' }).notNull().default(false)
	},
	(table) => ({
		orderingPeriodIdx: index('option_week_idx').on(table.orderingPeriodId),
		snackIdx: index('option_snack_idx').on(table.snackId)
	})
);

export const orderingPeriodOptionsRelations = relations(orderingPeriodOptions, ({ one, many }) => ({
	orderingPeriod: one(orderingPeriod, {
		fields: [orderingPeriodOptions.orderingPeriodId],
		references: [orderingPeriod.id]
	}),
	snack: one(snack, { fields: [orderingPeriodOptions.snackId], references: [snack.id] }),
	orders: many(orderLine)
}));

export const orderLine = sqliteTable(
	'order_line',
	{
		id: text('id').primaryKey(),
		userOrderConfigId: text('user_order_config_id')
			.notNull()
			.references(() => userOrderConfig.id),
		orderingPeriodId: text('week_id')
			.notNull()
			.references(() => orderingPeriod.id, { onDelete: 'cascade' }),
		snackId: text('snack_id')
			.notNull()
			.references(() => orderingPeriodOptions.id, { onDelete: 'cascade' }),
		quantity: integer('quantity').notNull().default(1),
		submitted: integer('submitted', { mode: 'boolean' }).notNull().default(false),
		purchased: integer('purchased', { mode: 'boolean' }).notNull().default(false)
	},
	(table) => ({
		orderingPeriodIdx: index('order_week_idx').on(table.orderingPeriodId),
		snackIdx: index('order_snack_idx').on(table.snackId),
		userIdx: index('order_user_idx').on(table.userOrderConfigId)
	})
);

export const orderLineRelations = relations(orderLine, ({ one }) => ({
	userOrderConfig: one(userOrderConfig, {
		fields: [orderLine.userOrderConfigId],
		references: [userOrderConfig.id]
	}),
	orderingPeriod: one(orderingPeriod, {
		fields: [orderLine.orderingPeriodId],
		references: [orderingPeriod.id]
	}),
	snack: one(orderingPeriodOptions, {
		fields: [orderLine.snackId],
		references: [orderingPeriodOptions.id]
	})
}));
