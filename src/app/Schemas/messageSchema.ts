import { z } from "zod";

export const MessageSchema = z.object({
  conent: z
    .string()
    .min(1, { message: "Cannot send an empty message" })
    .max(30, { message: "Cannot send message more than 30 characters" }),
});
