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

export const updateWorkspaceValidator = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name cannot exceed 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined, {
  message: "At least one field is required to update",
});

export type CreateWorkspaceInput =
  z.infer<typeof createWorkspaceValidator>;

export type UpdateWorkspaceInput =
  z.infer<typeof updateWorkspaceValidator>;
