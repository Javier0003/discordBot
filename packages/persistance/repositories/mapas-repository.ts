import { desc, eq, sql } from "drizzle-orm";
import GenericRepository from "./generic-repository";
import { mapas, plays } from "../drizzle/schemas/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default class MapasRepository extends GenericRepository<typeof mapas> {
    constructor(db: PostgresJsDatabase<Record<string, never>>) {
        super(mapas, db);
    }

    public async getPagedMapsWithPlays(offset: number, pageSize: number){
          return await this.db
            .select({ mapas, playCount: sql<string>`COUNT(${plays.mapId})` })
            .from(mapas)
            .leftJoin(plays, eq(mapas.oldMaps, plays.mapId))
            .groupBy(mapas.oldMaps)
            .orderBy(desc(mapas.order))
            .offset(offset)
            .limit(pageSize);
    }

    public async getOldestMapId(){
        const result = await this.db
            .select()
            .from(mapas)
            .orderBy(desc(mapas.order))
            .limit(1);
        
        return result.length > 0 ? result[0].oldMaps : null;
    }
}