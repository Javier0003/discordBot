import { Hono } from "hono";

const helloRouter = new Hono().get("/", (c) => c.text("Hello World!"));

export default helloRouter;