import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export type UserRole = "user" | "admin";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export interface UserModel extends Model<UserDocument> {}

export const User: UserModel =
  (mongoose.models.User as UserModel) ||
  mongoose.model<UserDocument, UserModel>("User", UserSchema);

