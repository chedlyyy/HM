import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export type CategoryDocument = InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export interface CategoryModel extends Model<CategoryDocument> {}

export const Category: CategoryModel =
  (mongoose.models.Category as CategoryModel) ||
  mongoose.model<CategoryDocument, CategoryModel>("Category", CategorySchema);

