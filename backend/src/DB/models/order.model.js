import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      trim: true,
    },
    products: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1, default: 1 },
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "An order must contain at least one product",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);