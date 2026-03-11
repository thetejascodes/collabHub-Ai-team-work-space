import { z } from "zod";

export const userValidator = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "member", "admin"]).default("user"),
  isVerified: z.boolean().default(false),
});

export type UserInput = z.infer<typeof userValidator>;