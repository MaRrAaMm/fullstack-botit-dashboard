import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    // image: {
    //   type: String,
    //   default: "",
    // },
    // stock: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    // },
  },
  {timestamps: true}
);

export const Product = model("Product", productSchema);