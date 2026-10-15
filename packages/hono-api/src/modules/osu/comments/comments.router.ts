import { Hono } from "hono";

const commentRouter = new Hono().post("/", async (c) => {
  try {
    const { commentRepository } = c.repositories;
    const id = c.req.param("id");
    const data = await c.req.formData();
    const comment = data.get("comment") as string;

    if (!comment) return c.json({ error: "No comment provided" }, 400);

    await commentRepository.create({
      mapId: Number(id),
      uId: c.userData.id,
      comment: comment,
      date: new Date().toISOString(),
    });

    return c.redirect(`/mapas/${id}`);
  } catch (error) {
    console.log(error);
  }
  return c.redirect("/");
});

export default commentRouter;
