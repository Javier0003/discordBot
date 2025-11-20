import { botStatus } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class BotStatusRepository  extends GenericRepository<typeof botStatus>{
    constructor(){
        super(botStatus);
    }
}