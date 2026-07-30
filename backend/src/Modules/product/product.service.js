import { Product } from "../../DB/models/product.model.js";
import { emitEvent } from "../../socket.js";

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  const search = req.query.search || "";
  const category = req.query.category || "";
  const sort = req.query.sort || "default";

  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category && category !== "all") {
    filter.category = category;
  }

  let query = Product.find(filter);

  if (sort === "price-asc") {
    query = query.sort({ price: 1 });
  }

  if (sort === "price-desc") {
    query = query.sort({ price: -1 });
  }

  if (sort === "name") {
    query = query.sort({ name: 1 });
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
