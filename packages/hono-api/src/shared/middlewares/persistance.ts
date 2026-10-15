import { registerRepositories, type RepositoryObj } from "@loabot/persistance";
import { createMiddleware } from "hono/factory";

let repositories: RepositoryObj | undefined = undefined;

export const setRepositories = createMiddleware(async (c, next) => {
  if (repositories) {
    c.set("repositories", repositories);
    await next();
  } else {
    repositories = registerRepositories();
    c.set("repositories", repositories);
    await next();
  }
});
