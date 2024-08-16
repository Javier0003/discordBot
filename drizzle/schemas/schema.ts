import { serial } from 'drizzle-orm/pg-core'
import { integer, pgTable, varchar,  } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }),
  osuId: integer('osuId').notNull(),
});

export const plays = pgTable('plays', {
  playId: serial('playId').primaryKey(),
  mapId: integer('mapId').notNull().references(() => mapas.oldMapId),
  uId: varchar('uid').notNull().references(() => users.id),
  rank: varchar('rank').notNull(),
  score: integer('score').notNull(),
  accuracy: varchar('accuracy').notNull(),
  puntos: integer('puntos').notNull().default(0),
})

export const mapas = pgTable('mapas', {
  oldMapId: integer('oldMaps').notNull().primaryKey(),
  oldMapMods: varchar('oldMapMods').notNull(),
  oldMapMinRank: varchar('oldMapMinRank').notNull(),
})

export type Users = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Plays = typeof plays.$inferSelect


