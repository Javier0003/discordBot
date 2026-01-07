import { Context, Next } from "hono";
import RouteBuilder from "../../../builders/route-builder";
import LoaSingleton from "../../../../structures/loa-client";
import { RepositoryObj } from "../../../../repositories/services-registration";

export default class ImportDiscordUsers extends RouteBuilder<Promise<Response>> {
    private readonly userRepository: RepositoryObj['userRepository'];

    constructor({ userRepository }: RepositoryObj) {
        super({
            method: "get",
            path: "/users/fetch-discord-users",
            devOnly: true
        })
        this.userRepository = userRepository;
    }


    public async event(c: Context, next?: Next): Promise<Response> {
        try {
            const users = await LoaSingleton.LoA.guilds.fetch("610193965878214678")

            console.log("Fetching discord users...")
            const xd = await users.members.fetch();

            const userList: { id: string; name: string; osuId: number }[] = [];
            xd.forEach((member) => {
                if (member.user.bot) return;
                userList.push({ id: member.user.id, name: member.user.username, osuId: 0 });
            })
            await this.userRepository.insertMany(userList);

            return c.json({ success: true, fetchedUsers: userList.length });
        } catch (err) {
            console.error(err);
            return c.json({ success: false }, 500);
        }
    }
}
