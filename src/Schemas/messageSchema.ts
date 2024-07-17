import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Cannot send an empty message" })
    .max(50, { message: "Cannot send message more than 50 characters" }),
});
