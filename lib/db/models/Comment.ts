import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

export type CommentDocument = InferSchemaType<typeof CommentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export interface CommentModel extends Model<CommentDocument> {}

export const Comment: CommentModel =
  (mongoose.models.Comment as CommentModel) ||
  mongoose.model<CommentDocument, CommentModel>("Comment", CommentSchema);

