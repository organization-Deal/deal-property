import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const enquiries = sqliteTable('enquiries', {
 id: text('id').primaryKey(), name: text('name').notNull(), phone: text('phone').notNull(), email: text('email').notNull().default(''),
 project: text('project').notNull(), ownership: text('ownership').notNull(), purpose: text('purpose').notNull(),
 visitDate: text('visit_date').notNull().default(''), contactTime: text('contact_time').notNull(), message: text('message').notNull().default(''),
 source: text('source').notNull(), consentVersion: text('consent_version').notNull(), createdAt: integer('created_at').notNull(),
});
