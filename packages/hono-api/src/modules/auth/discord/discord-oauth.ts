import { Hono } from "hono";
import { checkGuild, createToken, getUserData } from "../../../utils/discord.js";
import { setCookie } from "hono/cookie";

const discordOAuth = new Hono().get("/redirect", async (c) => {
  try {
    const code = c.req.query("code");
    if (!code) return c.json({ message: "BAD_REQUEST", detail: "Missing code parameter." }, 400);

    const data = await createToken(code);
    if (!data) return c.json({ message: "BAD_REQUEST", detail: "Failed to create token." }, 400);

    const accessToken = data.access_token;

    if (!(await checkGuild(accessToken)))
      return c.json({ message: "BAD_REQUEST", detail: "You are not a member of the required guild." }, 400);

    const userRes = await getUserData(accessToken);
    if (!userRes) return c.json({ message: "BAD_REQUEST", detail: "Failed to get user data." }, 400);
    // await sessionRepository.createSession(userRes.id, data.refresh_token)

    setCookie(c, "token", accessToken, { expires: new Date(Date.now() + data.expires_in * 1000) });
  } catch (error) {
    console.log(error);
  }
  return c.json({ message: "INTERNAL_SERVER_ERROR", detail: "An error occurred during the Discord OAuth process." }, 500);
});

export default discordOAuth;
