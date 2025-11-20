import { users } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class UserRepository extends GenericRepository<typeof users> {
    constructor() {
        super(users);
    }
}