import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import env from '../env'

export default class DbConnection {
  public static db: PostgresJsDatabase<Record<string, never>>

  constructor() {
    const queryClient = postgres(env.dbUrl);
    DbConnection.db = drizzle(queryClient);
    
  }
}



