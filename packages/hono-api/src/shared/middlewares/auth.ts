import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getUserData } from "../../utils/discord.js";

export const authMiddleware = createMiddleware(async (c, next) => {
  if (c.req.path === "/api/auth/discord/redirect") return await next();
  if (c.req.path === "/static/osu.svg") return await next();

  const cookie = getCookie(c, "token");
  if (c.req.path === "/" && !cookie) return await next();

  const userData = await getUserData(cookie!);

  if (!userData) {
    deleteCookie(c, "token");
    return c.redirect("/");
  }

  c.set("userData", userData);
  await next();
});
