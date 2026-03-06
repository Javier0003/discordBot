import { Context, Next } from "hono";
import RouteBuilder from "../../../builders/route-builder";
import { RepositoryObj } from "../../../../repositories/services-registration";

export default class DeleteBotResponse extends RouteBuilder<Promise<Response>> {
    private readonly randomReplyRepository: RepositoryObj["randomReplyRepository"];

    constructor({ randomReplyRepository }: RepositoryObj) {
        super({
            method: "get",
            path: "/bot/responses/delete/:id",
            devOnly: true
        });

        this.randomReplyRepository = randomReplyRepository;
    }

    public async event(c: Context, next?: Next): Promise<Response> {
        try {
            const id = c.req.param("id");

            await this.randomReplyRepository.delete(id);


            return c.redirect("/bot/responses");

        } catch (error) {
            console.error("Error deleting response:", error);
            return c.json({ message: "An error occurred while deleting the response." }, 500);
        }
    }
}