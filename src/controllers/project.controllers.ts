import type { Request, Response } from "express";
import { createProjectService, getProjectService, getProjectsServices } from "../services/project.services.js";
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

export const getProjectsController = async (req: Request, res: Response) => {
  try {
    const {
      limit,
      cursorCreatedAt,
      cursorId,
      sortBy,
      order,
    } = req.query;

    const workspaceId = req.params.workspaceId;
    const user = (req as any).user;

    const result = await getProjectsServices({
      user,
      workspaceId,
      limit: limit ? Number(limit) : 10,
      cursorCreatedAt,
      cursorId,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProject = async(req:Request,res:Response) => {
  try {
    const projectId = req.params.projectId as string;
    const user = (req as any).user;
    const project = await getProjectService({
      projectId,
      user
    })
    res.status(200).json(project)
  } catch (error) {
    
  }
}