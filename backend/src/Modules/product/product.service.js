import { Product } from "../../DB/models/product.model.js";
import { emitEvent } from "../../socket.js";
import { calculatePagination, buildFilter,getSortOption } from "./product.helpers.js";

export const createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  emitEvent("productCreated", product);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getAllProducts = async (req, res, next) => {
  const { page, limit, skip } = calculatePagination(
    req.query.page,
    req.query.limit,
  );
  const search = req.query.search || "";
  const category = req.query.category || "";
  const sort = req.query.sort || "default";

  const filter = buildFilter(search, category);

  let query = Product.find(filter);

  const sortOption = getSortOption(sort);

  if (sortOption) {
    query = query.sort(sortOption);
  }

  const products = await query.skip(skip).limit(limit);

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);
  return res.status(200).json({
    success: true,
    data: products,
    currentPage: page,
    totalPages,
    totalProducts,
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
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

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
