import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sessionTable } from "../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class SessionRepository extends GenericRepository<typeof sessionTable> {
  constructor(db: PostgresJsDatabase<Record<string, never>>) {
    super(sessionTable, db);
  }

  public async createSession(id: string, refreshToken: string): Promise<void> {
    try {
      await this.create({ id, refreshToken });
    } catch (error) {
      console.log("session already exists");
    }
  }
}
