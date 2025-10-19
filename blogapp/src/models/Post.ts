import mongoose, {Schema, Document} from "mongoose";
import  { IUser } from './User'

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published: boolean;
  author: IUser["_id"];
  tags: mongoose.Types.ObjectId[];
  likesCount: number;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    likesCount: { type: Number, default: 0 },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: "Category", 
      required: true  // Change to false if you want optional categories
    }
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);