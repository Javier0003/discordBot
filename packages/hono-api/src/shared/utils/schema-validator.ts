import type { ZodType } from "zod";
import { zValidator } from "@hono/zod-validator";
import { jsonErr } from "./result.js";
type ValidationTarget = Parameters<typeof zValidator>[0];

export const schemaValidator = <Target extends ValidationTarget, Schema extends ZodType>(
  target: Target,
  schema: Schema,
) =>
  zValidator(target, schema, (result, c) => {
    if (result.success) {
      return;
    }

    return jsonErr(c, "BAD_REQUEST");
  });
