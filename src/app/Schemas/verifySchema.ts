import { z } from "zod";

export const VerifySchema = z.object({
  identifier: z
    .string()
    .min(6, { message: "Verification code should be 6 characters" })
    .max(6),
});
