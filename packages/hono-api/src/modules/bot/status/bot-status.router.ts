import { Hono } from "hono";

const botStatusRouter = new Hono()
  .post("/", async (c) => {
    try {
      const body = await c.req.parseBody();

      const message = body.statusMessage as string;
      const type = parseInt(body.type as string);
      const url = body.url as string | undefined;

      if (message.length > 256 || (url && url.length > 256) || type < 0 || type > 5) {
        return c.json({ success: false, message: "Invalid body" }, 400);
      }

      // Assuming you have access to the botStatusRepository here
      await c.repositories.botStatusRepository.create({
        statusMessage: message,
        type: type,
        url: url ?? undefined,
      });

      return c.redirect("/bot/status");
    } catch (error) {
      console.log(error);
      return c.json({ success: false });
    }
  })
  .delete("/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      await c.repositories.botStatusRepository.delete(id);
      return c.json({ success: true });
    } catch (error) {
      console.log(error);
      return c.json({ success: false });
    }
  });

export default botStatusRouter;
