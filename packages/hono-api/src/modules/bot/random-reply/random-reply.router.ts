import { Hono } from "hono";
import RandomReplyService from "./random-reply.service.js";
import { validateAsync } from "zod";
import { jsonErr, jsonOk } from "../../../shared/utils/result.js";
import { schemaValidator } from "../../../shared/utils/schema-validator.js";
import { updateRandomReplySchema } from "./random-reply.validator.js";

const randomReplyRouter = new Hono()
  .post("/", async (c) => {
    try {
      const { randomReplyRepository } = c.repositories;
      const { reply } = await c.req.json();

      await randomReplyRepository.create({ reply });

      return c.json(
        {
          message: `response created successfully.`,
        },
        200,
      );
    } catch (error) {
      console.error("Error creating response:", error);
      return c.json({ message: "An error occurred while creating the response." }, 500);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const { randomReplyRepository } = c.repositories;
      const id = c.req.param("id");

      await randomReplyRepository.delete(id);
      return c.json(
        {
          message: `response deleted successfully.`,
        },
        200,
      );
    } catch (error) {
      console.error("Error deleting response:", error);
      return c.json({ message: "An error occurred while deleting the response." }, 500);
    }
  })
  .patch("/:id", schemaValidator("json", updateRandomReplySchema), async (c) => {
    const { randomReplyRepository } = c.repositories;
    const id = c.req.param("id");
    const { reply } = await c.req.json();
    const result = await RandomReplyService.updateRandomReply(randomReplyRepository, id, reply);

    if (!result) return jsonErr(c, "NOT_FOUND", `response with id ${id} not found.`);

    return jsonOk(c, {
      message: `response updated successfully.`,
      data: result,
    });
  });

export default randomReplyRouter;
