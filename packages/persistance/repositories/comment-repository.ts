import { eq } from "drizzle-orm";
import GenericRepository from "./generic-repository";
import { comments } from "../drizzle/schemas/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js/driver";

export default class CommentRepository extends GenericRepository<typeof comments>{
    constructor(db: PostgresJsDatabase<Record<string, never>>) {
        super(comments, db);
    }


    public async getByMapId(mapId: number) {
        const data = await this.db.select().from(this.entity).where(eq(comments.mapId,mapId));
        return data as unknown as typeof comments["$inferSelect"][];
    }
}