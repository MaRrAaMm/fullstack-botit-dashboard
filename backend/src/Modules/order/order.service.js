import { Order } from "../../DB/models/order.model.js";
import { Product } from "../../DB/models/product.model.js";
import { Cart } from "../../DB/models/cart.model.js";
import { emitEvent } from "../../socket.js";

export const checkout = async (req, res, next) => {
  const { customerName, shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.authUser._id }).populate(
    "products.product"
  );
  if (!cart || cart.products.length === 0) {
    throw new Error("Cart is empty", { cause: 400 });
  }

  const totalAmount = cart.products.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const orderItems = cart.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    user: req.authUser._id,
    customerName: customerName || req.authUser.name,
    products: orderItems,
    totalAmount,
    shippingAddress,
    status: "pending",
  });
  await order.populate("products.product");

  cart.products = [];
  await cart.save();
  emitEvent("orderCreated", order);

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
};

export const getUserOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.authUser._id })
    .populate("products.product")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};

export const createOrder = async (req, res, next) => {
  const { customerName, products } = req.body;
  const productIds = products.map((p) => p.product || p);
  const productList = await Product.find({
    _id: { $in: productIds },
  });

  if (productList.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  const productMap = {};
  productList.forEach((p) => {
    productMap[p._id.toString()] = p.price;
  });

  const orderItems = products.map((p) => ({
    product: p.product || p,
    quantity: p.quantity || 1,
  }));
  const totalAmount = orderItems.reduce(
    (total, item) => total + (productMap[item.product.toString()] || 0) * item.quantity,
    0
  );

  const order = await Order.create({
    customerName,
    products: orderItems,
    totalAmount,
  });
  await order.populate("products.product");
  emitEvent("orderCreated", order);

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

export const getAllOrders = async (req, res, next) => {
  const { startDate, endDate, minPrice, maxPrice } = req.query;
  const filter = {};

  if (startDate || endDate) {
    filter.orderDate = {};

    if (startDate) {
      filter.orderDate.$gte = new Date(startDate);
    }

    if (endDate) {
    //   const end = new Date(endDate);
    //   end.setUTCHours(23, 59, 59, 999);

      filter.orderDate.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  if (minPrice || maxPrice) {
    filter.totalAmount = {};

    if (minPrice) {
      filter.totalAmount.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.totalAmount.$lte = Number(maxPrice);
    }
  }
  console.log(filter);
  const orders = await Order.find(filter).populate("products.product").populate("user", "name email");

  return res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
};

export const getOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("products.product").populate("user", "name email");

  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }
  return res.status(200).json({
    success: true,
    data: order,
  });
};

export const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { customerName, products, status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }
  if (customerName) {
    order.customerName = customerName;
  }
  if (status) {
    order.status = status;
  }
  if (products) {
    const productIds = products.map((p) => p.product || p);
    const productList = await Product.find({
      _id: { $in: productIds },
    });

    if (productList.length !== productIds.length) {
      throw new Error("One or more products not found");
    }

    const productMap = {};
    productList.forEach((p) => {
      productMap[p._id.toString()] = p.price;
    });

    const orderItems = products.map((p) => ({
      product: p.product || p,
      quantity: p.quantity || 1,
    }));

    order.products = orderItems;
    order.totalAmount = orderItems.reduce(
      (total, item) => total + (productMap[item.product.toString()] || 0) * item.quantity,
      0
    );
  }

  await order.save();
  await order.populate("products.product");
  emitEvent("orderUpdated", order);
  
  return res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
};

export const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }
  emitEvent("orderDeleted", {
    id: order._id,
  });

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
};
