import { and, eq } from "drizzle-orm";
import { serverUsers } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class ServerUserRepository extends GenericRepository<typeof serverUsers>{
    constructor() {
        super(serverUsers)
    }

    public async isUserBanned(userId: string){
        const user = await this.getQueryable().where(and(eq(serverUsers.idServerUser, userId), eq(serverUsers.isVCBan, '1')))
        return user.length === 0 ? false : true
    }

    public async getBannedUsers(){
        return await this.getQueryable().where(eq(serverUsers.isVCBan, '1'))
    }
}