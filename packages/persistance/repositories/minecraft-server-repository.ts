import { eq } from "drizzle-orm";
import GenericRepository from "./generic-repository";
import { minecraftServers } from "../drizzle/schemas/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default class MinecraftServerRepository extends GenericRepository<typeof minecraftServers> {
    constructor(db: PostgresJsDatabase<Record<string, never>>) {
        super(minecraftServers, db);
    }

    public async getByName(name: string) {
        const server = await this.db.select().from(this.entity).where(eq(this.entity.name, name)).limit(1);

        return server[0];
    }
}