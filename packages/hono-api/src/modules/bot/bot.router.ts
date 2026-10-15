import { Hono } from "hono";
import botStatusRouter from "./status/bot-status.router.js";

const botRouter = new Hono().route("/status", botStatusRouter);

export default botRouter;
