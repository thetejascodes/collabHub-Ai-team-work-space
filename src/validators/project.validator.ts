import {z} from 'zod'

export const createProjectValidor = z.object({
    name:z.string().min(1,"Project name is required").max(100, "Project name cannot exceed 100 characters"),
    description:z.string().max(500,"Project Desription cannot exceed 500 character").optional(),
})

export type createProjectInput = z.infer<typeof createProjectValidor> 