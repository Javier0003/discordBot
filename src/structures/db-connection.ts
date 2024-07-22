import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import env from '../env';

export default class DbConnection{
  public static db: any

  constructor(){
    const sql = neon(env.dbUrl);
    DbConnection.db = drizzle(sql);
  }
}