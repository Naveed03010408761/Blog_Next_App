import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  WRITER = "WRITER",
  READER = "READER",
}

export interface IUser extends Document {
  email: string;
  name?: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.WRITER },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
