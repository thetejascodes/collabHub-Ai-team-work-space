import { Document, Types, Schema, model } from 'mongoose'

export interface ICommentCreate {
    taskId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'text' | 'file' | 'mention';
    content: string;
    mentions:[Types.ObjectId];
}

export interface IComment extends Document, ICommentCreate{
    _id:Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
}

const commentSchema = new Schema<IComment>({
    taskId:{
        type:Schema.Types.ObjectId,
        ref:'Task',
        required:true,
        index:true,
    },
    workspaceId:{
        type:Schema.Types.ObjectId,
        ref:'Workspace',
        required:true,
        index:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    type:{
        type:String,
        enum:['text','file','mention'],
        required:true,
        default:'text'
    },
    content:{
        type:String,
        trim:true,
        required:true,
        minLength:[1,'Comment must be at least 1 character long'],
        maxLength:[1000,'Comment must not exceed 1000 characters']
    },
    mentions:{
        type:[Types.ObjectId],
        ref:'User',
        default:[],
    }
},{timestamps:true})

commentSchema.index({ createdAt: -1, _id: -1 });
commentSchema.index({ taskId: 1, workspaceId: 1 });

commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

commentSchema.pre('save', async function () {
  if (this.isModified('content')) {
    this.content = this.content.trim();
  }
});

export const Comment = model<IComment>("Comment",commentSchema)
