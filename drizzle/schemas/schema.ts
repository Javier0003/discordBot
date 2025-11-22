import { char } from 'drizzle-orm/pg-core'
import { integer, pgTable, varchar, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: varchar('id', { length: 256 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  osuId: integer('osuId').notNull(),
})

export const plays = pgTable('plays', {
  playId: serial('playId').primaryKey(),
  mapId: integer('mapId').notNull().references(() => mapas.oldMaps),
  uId: varchar('uId').notNull().references(() => users.id),
  rank: varchar('rank').notNull(),
  score: integer('score').notNull(),
  accuracy: varchar('accuracy').notNull(),
  puntos: integer('puntos').notNull().default(0),
  pp: integer('pp').notNull().default(0),
  combo: integer('combo').notNull().default(0),
})

export const comments = pgTable('comments', {
  commentId: serial('commentId').primaryKey(),
  mapId: integer('mapId').notNull().references(() => mapas.oldMaps),
  uId: varchar('uId').notNull().references(() => users.id),
  comment: varchar('comment').notNull(),
  date: varchar('date').notNull()
})

export type Comments = typeof comments.$inferSelect

export const mapas = pgTable('mapas', {
  oldMaps: integer('oldMaps').notNull().primaryKey(),
  oldMapMods: varchar('oldMapMods').notNull(),
  oldMapMinRank: varchar('oldMapMinRank').notNull(),
  mapName: varchar('mapName').notNull(),
  date: varchar('date').notNull(),
  order: serial('order').notNull(),
  picUrl: varchar('picUrl').notNull().default("/static/osu.svg")
})

export const sessionTable = pgTable('session', {
  id: varchar('id', { length: 256 }).primaryKey().references(() => users.id),
  refreshToken: varchar('refreshToken', { length: 256 }).notNull(),
})

export const serverUsers = pgTable('serverUsers', {
  idServerUser: varchar('id', { length: 256 }).references(() => users.id).primaryKey(),
  isDev: char('isDev', { length: 1 }).default('0'),
  isVCBan: char('isVCBan', { length: 1 }).default('0'),
})

export const botStatus = pgTable('botStatus', {
  id: serial('id').primaryKey(),
  statusMessage: varchar('statusMessage', {length: 256}).notNull(),
  type: integer('type').notNull(),
  url: varchar('url', {length: 256})
})

export const randomReplies = pgTable('randomReplies', {
  idReply: serial('idReply').primaryKey(),
  reply: varchar('reply', {length: 256}).notNull(),
})

export type ServerUsers = typeof serverUsers.$inferSelect

export type Users = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Mapas = typeof mapas.$inferSelect
export type NewMap = typeof mapas.$inferInsert

export type Plays = typeof plays.$inferSelect
export type NewPlay = typeof plays.$inferInsert