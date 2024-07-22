import { integer, pgTable, varchar,  } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }) ,
  completados: integer('completados').default(0),
});

export type Users = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert


