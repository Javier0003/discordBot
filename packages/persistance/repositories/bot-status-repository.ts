import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { botStatus } from "../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class BotStatusRepository  extends GenericRepository<typeof botStatus>{
    constructor(db: PostgresJsDatabase<Record<string, never>>){
        super(botStatus, db);
    }
}