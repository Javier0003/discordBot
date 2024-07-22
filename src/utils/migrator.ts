import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import env from '../env'
import { join } from 'path'

const path = join(__dirname, '../../drizzle/migrations')

async function main() {
  const migrationClient = postgres(env.dbUrl, {max: 1})

  await migrate(drizzle(migrationClient),{ 
    migrationsFolder: path,
  })

  await migrationClient.end()
}

main()