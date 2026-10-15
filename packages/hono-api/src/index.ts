import { Hono } from "hono";
import { cors } from "hono/cors";
import { loggerMiddleware } from "./shared/middlewares/logger.js";
import { serve } from "@hono/node-server";
import type { UserData } from "./utils/discord.js";
import type { RepositoryObj } from "@loabot/persistance";
import { setRepositories } from "./shared/middlewares/persistance.js";
import authRouter from "./modules/auth/index.router.js";
import helloRouter from "./modules/hello/hello.router.js";

declare module "hono" {
  interface Context {
    userData: UserData;
    repositories: RepositoryObj;
  }
}

const app = new Hono()
  .use("/*", cors())
  .use("/*", setRepositories)
  .use("/*", loggerMiddleware)
  .route("/auth", authRouter)
  .route("/hello", helloRouter);

function init(domain: string) {
  return serve(
    {
      fetch: (req) => app.fetch(req),
      port: 42069,
    },
    (info) => {
      console.log(`Server is running on port ${domain}${info.port}`);
    },
  );
}

export default { init };
