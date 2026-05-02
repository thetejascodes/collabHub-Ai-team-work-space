import type { Request, Response, NextFunction } from "express";
import {
  getWorkspaceActivities,
  getUnreadActivities,
  markActivityAsRead,
} from "../services/activity.services.js";
import ApiError from "../utils/apiError.utils.js";

export const getWorkspaceActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;
    const activities = await getWorkspaceActivities(workspaceId, limit, skip);
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

export const getUnreadActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId as string;
    const activities = await getUnreadActivities(workspaceId);
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { activityId } = req.params;
    if (!activityId || typeof activityId !== 'string') {
      throw ApiError.badRequest("Invalid activity ID");
    }
    await markActivityAsRead(activityId);
    res.status(200).json({ message: "Activity marked as read" });
  } catch (error) {
    next(error);
  }
};