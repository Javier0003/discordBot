import { PgTable } from "drizzle-orm/pg-core";
import LoaClient from "../structures/loa-client";
import { eq } from "drizzle-orm";
import { Column } from "drizzle-orm";

export default abstract class GenericRepository<T extends PgTable, IdColumn extends Column<any, any, any>> extends LoaClient {
    private readonly entity: T;
    private readonly idColumn: IdColumn;
    constructor(entity: T, idColumn: IdColumn) {
        super();
        this.entity = entity;
        this.idColumn = idColumn;
    }

    public async getAll(): Promise<T["$inferSelect"][]> {
        const data = await this.db.select().from(this.entity)
        return data as unknown as T["$inferSelect"][];
    }

    public async getById(id: number | string): Promise<T["$inferSelect"] | null> {
        const data = await this.db.select().from(this.entity).where(eq(this.idColumn, id)).limit(1);
        return data[0] as T["$inferSelect"] ?? null;
    }

    public async create(data: T["$inferInsert"]): Promise<T["$inferSelect"]> {
        const [created] = await this.db.insert(this.entity).values(data).returning();
        return created as unknown as T["$inferSelect"];
    }

    public async update(id: number | string, data: Partial<T["$inferInsert"]>): Promise<T["$inferSelect"] | null> {
        return this.db.update(this.entity).set(data).where(eq(this.idColumn, id)).returning().then(res => res[0] as unknown as T["$inferSelect"] ?? null);
    }

    public async delete(id: number | string): Promise<boolean> {
        const deleted = await this.db.delete(this.entity).where(eq(this.idColumn, id)).returning();
        return deleted.length > 0;
    }

    public async getPaged(page: number, pageSize: number = 20): Promise<T["$inferSelect"][]> {
        const data = await this.db.select().from(this.entity).offset((page - 1) * pageSize).limit(pageSize);
        return data as unknown as T["$inferSelect"][];
    }

    public getQueryable() {
        return this.db;
    }
}