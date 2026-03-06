import { Context, Next } from "hono";
import RouteBuilder from "../../../builders/route-builder";
import { RepositoryObj } from "../../../../repositories/services-registration";

export default class CreateBotResponse extends RouteBuilder<Promise<Response>> {
    private readonly randomReplyRepository: RepositoryObj["randomReplyRepository"];

    constructor({ randomReplyRepository }: RepositoryObj) {
        super({
            method: "post",
            path: "/bot/responses",
        });

        this.randomReplyRepository = randomReplyRepository;
    }

    public async event(c: Context, next?: Next): Promise<Response> {
        try {
            const { reply } = await c.req.json();

            await this.randomReplyRepository.create({ reply });

            return c.json({
                message: `response created successfully.`,
            })
        } catch (error) {
            console.error("Error creating response:", error);
            return c.json({ message: "An error occurred while creating the response." }, 500);
        }

    }
}