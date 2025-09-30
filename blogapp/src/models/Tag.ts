import mongoose, {Schema, Document} from "mongoose";

export interface ITag extends Document{
    name: string,
    posts: mongoose.Types.ObjectId[];
}

const TagSchema = new Schema<ITag>(
    {
    name: { type: String, required: true, unique: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

export default  mongoose.models.Tag || mongoose.model<ITag>("Tag",TagSchema);