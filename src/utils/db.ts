import { drizzle,  } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import env from '../env'

// const queryClient = ;
export const db = drizzle(postgres(env.dbUrl));
