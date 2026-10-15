import { and, eq } from "drizzle-orm";
import GenericRepository from "./generic-repository";
import { serverUsers } from "../drizzle/schemas/schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export default class ServerUserRepository extends GenericRepository<typeof serverUsers> {
  constructor(db: PostgresJsDatabase<Record<string, never>>) {
    super(serverUsers, db);
  }

  public async isUserBanned(userId: string) {
    const user = await this.getQueryable().where(
      and(eq(serverUsers.idServerUser, userId), eq(serverUsers.isVCBan, "1")),
    );
    return user.length === 0 ? false : true;
  }

  public async getBannedUsers() {
    return await this.getQueryable().where(eq(serverUsers.isVCBan, "1"));
  }

  public async isDev(userId: string) {
    const user = await this.getQueryable().where(
      and(eq(serverUsers.idServerUser, userId), eq(serverUsers.isDev, "1")),
    );
    return user.length === 0 ? false : true;
  }
}
