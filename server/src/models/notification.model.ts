import { Document, model, Schema, Types } from 'mongoose';
import { ActivityActionTypes, EntityTypes } from './activity.model.js';

export interface INotification extends Document {
  userId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  actionType: typeof ActivityActionTypes[keyof typeof ActivityActionTypes];
  entityType: typeof EntityTypes[keyof typeof EntityTypes];
  entityId: Types.ObjectId;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Workspace',
      index: true,
    },
    actionType: {
      type: String,
      enum: Object.values(ActivityActionTypes),
      required: true,
    },
    entityType: {
      type: String,
      enum: Object.values(EntityTypes),
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ workspaceId: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
