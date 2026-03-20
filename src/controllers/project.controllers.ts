import type { Request, Response } from "express";
import { createProjectService } from "../services/project.services.js";
import { createProjectValidator } from "../validators/project.validator.js";

export const createProject = async (req: Request, res: Response) => {
  try {
    const parsed = createProjectValidator.safeParse(req.body);
    if(!parsed.success){
        res.status(400).json(parsed.error)
    }
    const user = (req as any).user;
    const project = await createProjectService({
      parsed,
      user,
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
