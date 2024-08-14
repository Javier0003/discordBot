import { db } from './db'
import { mapas, plays, users } from '../../drizzle/schemas/schema'

async function purgeDb() {
  await db.delete(plays)

  await db.delete(mapas)

  await db.delete(users)
}

purgeDb()