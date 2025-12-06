import { eq, inArray, ne, not } from "drizzle-orm";
import { serverUsers, users } from "../../drizzle/schemas/schema";
import { getSomeUserData } from "../api/utils/discord";
import GenericRepository from "./generic-repository";

export default class UserRepository extends GenericRepository<typeof users> {
    constructor() {
        super(users);
    }

    public async getUsersWithDiscordData(userList: typeof users.$inferSelect[]) {
        const idList = userList.map(user => user.id ?? "");
        const serverUsersData = await this.db.select().from(serverUsers).where(inArray(serverUsers.idServerUser, idList))
        const userData = await Promise.all(userList.map(user => getSomeUserData(user.id ?? "")));
        return userList.map((user, index) => ({
            ...user,
            ...userData[index],
            serverUsers: serverUsersData.find(su => su.idServerUser === user.id) || null
        }));
    }


    public async getByIdList(idList: string[]) {
        if(idList.length === 0) return [];
        return await this.getQueryable().where(inArray(this.entity.id, idList));
    }

    public async insertMany(userList: { id: string; name: string; osuId: number }[]) {
        if(userList.length === 0) return;
        await this.db.insert(this.entity).values(userList).onConflictDoNothing({target: this.entity.id});
    }

    public async getOsuPlayerList(): Promise<{id: string, osuId: number, name: string}[]> {
        const usersData = await this.db.select().from(this.entity).where(ne(this.entity.osuId, 0));
        return usersData;
    }
}
