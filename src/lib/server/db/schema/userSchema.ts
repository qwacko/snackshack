import { sqliteTable, text, blob, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { orderLine, userOrderConfig } from './snackSchema';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	admin: integer('admin', { mode: 'boolean' }).notNull().default(false)
});

export const userReferences = relations(user, ({ one, many }) => ({
	userOrderConfig: one(userOrderConfig, {
		fields: [user.id],
		references: [userOrderConfig.userId]
	}),
	sessions: many(session),
	keys: many(key),
	orderLines: many(orderLine)
}));

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	activeExpires: blob('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint'
	}).notNull()
});

export const sessionReferences = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	hashedPassword: text('hashed_password')
});

export const keyReferences = relations(key, ({ one }) => ({
	user: one(user, { fields: [key.userId], references: [user.id] })
}));
