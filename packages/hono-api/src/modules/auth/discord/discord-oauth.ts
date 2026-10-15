import { Hono } from "hono";
import { checkGuild, createToken, getUserData } from "../../../utils/discord.js";
import { setCookie } from "hono/cookie";
import { jsonErr } from "../../../shared/utils/result.js";

const discordOAuth = new Hono().get("/redirect", async (c) => {
  try {
    const code = c.req.query("code");
    if (!code) return jsonErr(c, "BAD_REQUEST", "Missing code parameter.");

    const data = await createToken(code);
    if (!data) return jsonErr(c, "BAD_REQUEST", "Failed to create token.");

    const accessToken = data.access_token;

    if (!(await checkGuild(accessToken)))
      return jsonErr(c, "BAD_REQUEST", "You are not a member of the required guild.");

    const userRes = await getUserData(accessToken);
    if (!userRes) return jsonErr(c, "BAD_REQUEST", "Failed to get user data.");
    // await sessionRepository.createSession(userRes.id, data.refresh_token)

    setCookie(c, "token", accessToken, { expires: new Date(Date.now() + data.expires_in * 1000) });
  } catch (error) {
    console.log(error);
  }
  return jsonErr(c, "INTERNAL_SERVER_ERROR", "An error occurred during the Discord OAuth process.");
});

export default discordOAuth;
