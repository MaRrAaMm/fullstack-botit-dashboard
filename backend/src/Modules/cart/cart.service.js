import { Cart } from "../../DB/models/cart.model.js";
import { Product } from "../../DB/models/product.model.js";

export const getCart = async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.authUser._id }).populate(
    "products.product"
  );

  if (!cart) {
    cart = await Cart.create({ user: req.authUser._id, products: [] });
  }

  return res.status(200).json({
    success: true,
    data: cart,
  });
};

export const addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  let cart = await Cart.findOne({ user: req.authUser._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.authUser._id,
      products: [{ product: productId, quantity }],
    });
  } else {
    const existingItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
  }

  await cart.populate("products.product");

  return res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: cart,
  });
};

export const updateCartItem = async (req, res, next) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.authUser._id });
  if (!cart) {
    throw new Error("Cart not found", { cause: 404 });
  }

  const item = cart.products.find(
    (item) => item.product.toString() === productId
  );
  if (!item) {
    throw new Error("Product not in cart", { cause: 404 });
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("products.product");

  return res.status(200).json({
    success: true,
    message: "Cart updated",
    data: cart,
  });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.authUser._id });
  if (!cart) {
    throw new Error("Cart not found", { cause: 404 });
  }

  cart.products = cart.products.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();
  await cart.populate("products.product");

  return res.status(200).json({
    success: true,
    message: "Product removed from cart",
    data: cart,
  });
};

export const clearCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.authUser._id });
  if (!cart) {
    throw new Error("Cart not found", { cause: 404 });
  }

  cart.products = [];
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Cart cleared",
    data: cart,
  });
};
