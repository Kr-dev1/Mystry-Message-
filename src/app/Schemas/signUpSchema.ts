import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(15, "Username must be no more than 15 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special character");

export const SignUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
