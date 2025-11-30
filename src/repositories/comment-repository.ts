import { eq } from "drizzle-orm";
import { comments } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class CommentRepository extends GenericRepository<typeof comments>{
    constructor() {
        super(comments);
    }


    public async getByMapId(mapId: number) {
        const data = await this.db.select().from(this.entity).where(eq(comments.mapId,mapId));
        return data as unknown as typeof comments["$inferSelect"][];
    }
}