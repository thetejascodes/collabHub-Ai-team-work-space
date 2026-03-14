import { z } from "zod";

export const createWorkspaceValidator = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
});

export type CreateWorkspaceInput =
  z.infer<typeof createWorkspaceValidator>;