import { eq } from "drizzle-orm";
import { minecraftServers } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class MinecraftServerRepository extends GenericRepository<typeof minecraftServers> {
    constructor() {
        super(minecraftServers)
    }

    public async getByName(name: string) {
        const server = await this.db.select().from(this.entity).where(eq(this.entity.name, name)).limit(1);

        return server[0];
    }
}