import { Activity, ActivityActionTypes, EntityTypes, type IActivity } from "../models/activity.model.js";
import { Notification } from "../models/notification.model.js";
import { Workspace } from "../models/workspace.model.js";
import { Types } from "mongoose";
import ApiError from "../utils/apiError.utils.js";

// Re-export constants for use in other services
export { ActivityActionTypes, EntityTypes };

export interface LogActivityInput {
  workspaceId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  actionType: typeof ActivityActionTypes[keyof typeof ActivityActionTypes];
  entityType: typeof EntityTypes[keyof typeof EntityTypes];
  entityId: string | Types.ObjectId;
  message: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
}

export const logActivity = async (input: LogActivityInput): Promise<IActivity> => {
  try {
    const activity = new Activity({
      workspaceId: new Types.ObjectId(input.workspaceId),
      userId: new Types.ObjectId(input.userId),
      actionType: input.actionType,
      entityType: input.entityType,
      entityId: new Types.ObjectId(input.entityId),
      message: input.message,
      details: input.details || null,
      metadata: input.metadata || null,
    });

    const savedActivity = await activity.save();

    // Create notifications for workspace members except the actor
    const workspace = await Workspace.findById(input.workspaceId).populate('members.user');
    if (workspace) {
      const actorId = new Types.ObjectId(input.userId);
      const memberIds = workspace.members.map((member) => {
        const user = member.user as any;
        return user && typeof user === 'object' && 'equals' in user
          ? user
          : new Types.ObjectId(user);
      });

      let recipients = memberIds.filter((memberId) => !memberId.equals(actorId));

      // If there are no other workspace members yet, notify the actor too.
      if (recipients.length === 0 && memberIds.some((memberId) => memberId.equals(actorId))) {
        recipients = [actorId];
      }

      const notifications = recipients.map((recipientId) => ({
        userId: recipientId,
        workspaceId: input.workspaceId,
        actionType: input.actionType,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
        isRead: false,
        metadata: input.metadata,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    return savedActivity;
  } catch (error) {
    console.error("Activity logging error:", error);
    throw error;
  }
};


export const getWorkspaceActivities = async (
  workspaceId: string,
  limit: number = 50,
  skip: number = 0
): Promise<IActivity[]> => {
  return Activity.find({ workspaceId: new Types.ObjectId(workspaceId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("userId", "name email avatar");
};


export const getUserActivities = async (
  userId: string,
  limit: number = 50,
  skip: number = 0
): Promise<IActivity[]> => {
  return Activity.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};


export const getUnreadActivities = async (workspaceId: string): Promise<IActivity[]> => {
  return Activity.find({
    workspaceId: new Types.ObjectId(workspaceId),
    isRead: false,
  }).sort({ createdAt: -1 });
};


export const markActivityAsRead = async (activityId: string): Promise<void> => {
  await Activity.updateOne(
    { _id: new Types.ObjectId(activityId) },
    { isRead: true }
  );
};
