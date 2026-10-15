import { Hono } from "hono";
import { authMiddleware } from "../../shared/middlewares/auth.js";

const minecraftRouter = new Hono().use(authMiddleware).post("/register-server", async (c) => {
  const { minecraftServersRepository, serverUsersRepository } = c.repositories;
  const { name, ip, port } = await c.req.json();

  const dev = await serverUsersRepository.getById(c.userData.id);

  if (!dev?.isDev) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  await minecraftServersRepository.create({
    name,
    ip,
    port: Number(port),
  });

  return c.json({ message: "Server registered successfully" }, 201);
});

export default minecraftRouter;
