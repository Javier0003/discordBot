import { randomReplies } from "../../drizzle/schemas/schema";
import GenericRepository from "./generic-repository";

export default class RandomReplyRepository extends GenericRepository<typeof randomReplies>{
    constructor(){
        super(randomReplies)
    }


    public async getRandomReply(): Promise<string | null> {
        const allReplies = await this.getAll();
        if(allReplies.length === 0){
            throw new Error("No replies found");
        }
        const randomIndex = Math.floor(Math.random() * allReplies.length);
        return allReplies[randomIndex].reply;
    }
}