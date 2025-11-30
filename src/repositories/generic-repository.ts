import { PgTable } from "drizzle-orm/pg-core";
import LoaSingleton from "../structures/loa-client";
import { eq } from "drizzle-orm";
import { Column } from "drizzle-orm";

type DataTypeToPrimitive<T extends string> =
    T extends 'string' ? string :
    T extends 'number' | 'integer' | 'int' ? number :
    T extends 'boolean' ? boolean :
    never;

export default abstract class GenericRepository<T extends PgTable> extends LoaSingleton {
    protected readonly entity: T;
    private readonly idColumn: Column;
    constructor(entity: T) {
        super();
        this.entity = entity;

        const pk = this.getPk();
        if (!pk) {
            throw new Error("Primary key column not found in the entity.");
        }
        this.idColumn = pk;
    }

    private getPk(): Column | undefined {
        for (const key in this.entity) {
            const value = (this.entity as any)[key];

            if (value.primary) {
                return value as Column;
            }
        }
    }

    public async getAll(): Promise<T["$inferSelect"][]> {
        const data = await this.db.select().from(this.entity)
        return data as unknown as T["$inferSelect"][];
    }

    public async getById(id: DataTypeToPrimitive<typeof this.idColumn["dataType"]>): Promise<T["$inferSelect"] | null> {
        const data = await this.db.select().from(this.entity).where(eq(this.idColumn, id)).limit(1);
        return data[0] as T["$inferSelect"] ?? null;
    }

    public async create(data: T["$inferInsert"]): Promise<T["$inferSelect"]> {
        const [created] = await this.db.insert(this.entity).values(data).returning();
        return created as unknown as T["$inferSelect"];
    }

    public async update(id: DataTypeToPrimitive<typeof this.idColumn["dataType"]>, data: Partial<T["$inferInsert"]>): Promise<T["$inferSelect"] | null> {
        const [updated] = await this.db.update(this.entity).set(data).where(eq(this.idColumn, id)).returning();
        return updated as unknown as T["$inferSelect"] ?? null;
    }

    public async delete(id: DataTypeToPrimitive<typeof this.idColumn["dataType"]>): Promise<boolean> {
        const deleted = await this.db.delete(this.entity).where(eq(this.idColumn, id)).returning();
        return deleted.length > 0;
    }

    public async getPaged(page: number, pageSize: number = 20): Promise<T["$inferSelect"][]> {
        const data = await this.db.select().from(this.entity).offset((page - 1) * pageSize).limit(pageSize);
        return data as unknown as T["$inferSelect"][];
    }

    public getQueryable() {
        return this.db.select().from(this.entity);
    }
}