import { Hono } from "hono";
import discordOAuth from "./discord/discord-oauth.js";

const authRouter = new Hono().route("/discord", discordOAuth);

export default authRouter;
