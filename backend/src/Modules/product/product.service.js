import { Product } from "../../DB/models/product.model.js";
import { emitEvent } from "../../socket.js";

export const createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  emitEvent("productCreated", product);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
};

export const getAllProducts = async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).json({
    success: true,
    data: products
  });
};

export const getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }
  return res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  emitEvent("productUpdated", product);
  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

export const deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  emitEvent("productDeleted", { id: product._id });
  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};