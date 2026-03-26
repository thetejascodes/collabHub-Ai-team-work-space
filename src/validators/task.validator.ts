import { z } from "zod";
import { Types } from "mongoose";

const objectIdValidator = (fieldName: string) =>
  z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: `Invalid ${fieldName}`,
  });

const taskStatusValidator = z.enum(["todo", "in-progress", "done"], {
  error: "Status must be one of: todo, in-progress, done",
});

const taskPriorityValidator = z.enum(["low", "medium", "high"], {
  error: "Priority must be one of: low, medium, high",
});

const optionalDateValidator = z
  .union([z.date(), z.string().datetime()])
  .optional();

export const createTaskValidator = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Task description cannot exceed 500 characters")
    .optional(),

  status: taskStatusValidator.optional(),

  priority: taskPriorityValidator.optional(),

  assignedTo: objectIdValidator("assignedTo").optional(),

  dueDate: optionalDateValidator,
});

export const getTasksQueryValidator = z.object({
  projectId: objectIdValidator("projectId").optional(),
  assignedTo: objectIdValidator("assignedTo").optional(),
  createdBy: objectIdValidator("createdBy").optional(),
  status: taskStatusValidator.optional(),
  priority: taskPriorityValidator.optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  cursorCreatedAt: z.string().datetime().optional(),
  cursorId: objectIdValidator("cursorId").optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const updateTaskValidator = z
  .object({
    title: z
      .string()
      .min(1, "Task title is required")
      .max(100, "Task title cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .max(500, "Task description cannot exceed 500 characters")
      .optional(),

    status: taskStatusValidator.optional(),

    priority: taskPriorityValidator.optional(),

    assignedTo: objectIdValidator("assignedTo").optional(),

    dueDate: optionalDateValidator,

    completedAt: optionalDateValidator,
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.priority !== undefined ||
      data.assignedTo !== undefined ||
      data.dueDate !== undefined ||
      data.completedAt !== undefined,
    {
      message: "At least one field is required to update",
    }
  );

export type CreateTaskInput = z.infer<typeof createTaskValidator>;
export type GetTasksQueryInput = z.infer<typeof getTasksQueryValidator>;
export type UpdateTaskInput = z.infer<typeof updateTaskValidator>;
