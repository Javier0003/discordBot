import { createMiddleware } from "hono/factory";

export const loggerMiddleware = createMiddleware(async (c, next) => {
  console.log(`Request: ${c.req.method} ${c.req.url}`);
  await next();
});
