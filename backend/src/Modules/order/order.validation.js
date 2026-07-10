import Joi from "joi";
import { generalField } from "../../Middlewares/validation.middleware.js";

const productItem = Joi.object({
  product: generalField.id.required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const createOrder = Joi.object({
  customerName: Joi.string().min(3).max(100).required(),
  products: Joi.alternatives()
    .try(
      Joi.array().items(productItem).min(1),
      Joi.array().items(generalField.id).min(1)
    )
    .required(),
});

export const updateOrder = Joi.object({
  id: generalField.id.required(),
  customerName: Joi.string().min(3).max(100),
  status: Joi.string().valid("pending", "confirmed", "shipped", "delivered"),
  products: Joi.alternatives()
    .try(
      Joi.array().items(productItem).min(1),
      Joi.array().items(generalField.id).min(1)
    )
    .optional(),
});

export const getAllOrders = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional()
});

export const getOrder = Joi.object({
  id: generalField.id.required(),
});

export const deleteOrder = Joi.object({
  id: generalField.id.required(),
});