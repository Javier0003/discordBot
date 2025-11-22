import { plays } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository"

export default class PlayRepository extends GenericRepository<typeof plays>{
    constructor() {
        super(plays)
    }
}