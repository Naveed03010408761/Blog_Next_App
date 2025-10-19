import mongoose, {Schema, Document} from "mongoose";

export interface ILike extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const LikeSchema = new Schema<ILike>({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
},{timestamps:true})

// Add compound index
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);