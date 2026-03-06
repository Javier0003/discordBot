import { Context, Next } from "hono";
import RouteBuilder from "../../../builders/route-builder";

export default class RegisterMinecraftServer extends RouteBuilder<Promise<Response>> {
    constructor() {
        super({
            method: "post",
            path: "/minecraft/register-server"
        });
    }

    public async event(c: Context, next?: Next): Promise<Response> {
        const { minecraftServersRepository, serverUsersRepository } = c.repositories;
        const { name, ip, port } = await c.req.json();

        const dev = await serverUsersRepository.getById(c.userData.id);

        if (!dev?.isDev) {
            return c.json({ message: "Unauthorized" }, 401);
        }

        await minecraftServersRepository.create({
            name,
            ip,
            port: Number(port)
        });

        return c.json({ message: "Server registered successfully" }, 201);
    }
}