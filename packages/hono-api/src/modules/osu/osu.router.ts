import { Hono } from "hono";
import commentRouter from "./comments/comments.router.js";

const osuRouter = new Hono().route("/comment", commentRouter);

export default osuRouter;
