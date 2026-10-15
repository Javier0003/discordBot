import z from "zod";

export const updateRandomReplySchema = z.object({
  reply: z
    .string()
    .min(1, { message: "Reply cannot be empty" })
    .max(200, { message: "Reply cannot exceed 200 characters" }),
});
