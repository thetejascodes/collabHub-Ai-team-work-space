import { z } from "zod";
import { Types } from "mongoose";

export const createProjectValidator = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Project description cannot exceed 500 characters")
    .optional(),

  workspaceId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid workspaceId",
    }),

  leadId: z
    .string()
    .optional()
    .refine((val) => !val || Types.ObjectId.isValid(val), {
      message: "Invalid leadId",
    }),
    
  settings: z.record(z.string(), z.any()).optional()
});

export type CreateProjectInput = z.infer<typeof createProjectValidator>;