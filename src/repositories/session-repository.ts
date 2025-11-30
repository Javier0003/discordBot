import { sessionTable } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class SessionRepository extends GenericRepository<typeof sessionTable> {
    constructor() {
        super(sessionTable);
    }

    public async createSession(id: string, refreshToken: string): Promise<void> {
        try {
            await this.create({ id, refreshToken })
        } catch (error) {
            console.log("session already exists")
        }
    }
}