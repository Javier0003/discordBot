import { Hono } from "hono";

const userRouter = new Hono()
  .patch("/:id/role", async (c) => {
    try {
      const { serverUsersRepository } = c.repositories;
      const userId = c.req.param("id");
      const body = await c.req.json<{ isDev: string }>();

      const user = await serverUsersRepository.getById(userId);

      if (!user) {
        await serverUsersRepository.create({
          idServerUser: userId,
          isDev: body.isDev,
          isVCBan: "0",
        });
      } else {
        await serverUsersRepository.update(userId, { isDev: body.isDev });
      }

      return c.json({ success: true, user: { ...user, isDev: body.isDev } });
    } catch (error) {
      console.log(error);
      return c.json({ success: false });
    }
  })
  .patch("/:id/vcban", async (c) => {
    try {
      const { serverUsersRepository } = c.repositories;
      const userId = c.req.param("id");
      const body = await c.req.json<{ isVCBan: string }>();

      const user = await serverUsersRepository.getById(userId);

      if (!user) {
        await serverUsersRepository.create({
          idServerUser: userId,
          isDev: "0",
          isVCBan: body.isVCBan,
        });
      } else {
        await serverUsersRepository.update(userId, { isVCBan: body.isVCBan });
      }

      return c.json({ success: true, user: { ...user, isVCBan: body.isVCBan } });
    } catch (error) {
      console.log(error);
      return c.json({ success: false });
    }
  });

export default userRouter;