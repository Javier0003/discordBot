import { Context, Next } from "hono";
import RouteBuilder from "../../../builders/route-builder";
import { RepositoryObj } from "../../../../repositories/services-registration";

export default class EditBotResponse extends RouteBuilder<Promise<Response>> {
    private readonly randomReplyRepository: RepositoryObj["randomReplyRepository"];

    constructor({ randomReplyRepository }: RepositoryObj) {
        super({
            method: "patch",
            path: "/bot/responses/:id",
        });

        this.randomReplyRepository = randomReplyRepository;
    }

    public async event(c: Context, next?: Next): Promise<Response> {
        try {
            const id = c.req.param("id");
            const { reply } = await c.req.json();

            await this.randomReplyRepository.update(id, {
                reply
            })

            return c.json({
                message: `edit response with ID: ${id}`
            })
        } catch (error) {
            console.log(error)

            return c.json({
                message: `Error editing response`
            }, 500);
        }
    }
}