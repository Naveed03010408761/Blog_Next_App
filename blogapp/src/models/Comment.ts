import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { 
      type: String, 
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      minlength: [1, "Comment cannot be empty"]
    },
    author: {
      id: { 
        type: String, 
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
      email: { 
        type: String, 
        required: true 
      },
      avatar: { 
        type: String, 
        default: "" 
      }
    },
    postId: { 
      type: String, 
      required: [true, "Post ID is required"],
      index: true // For faster queries
    },
    isEdited: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Add index for better performance when querying comments by post
CommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.models.Comment || 
  mongoose.model<IComment>("Comment", CommentSchema);