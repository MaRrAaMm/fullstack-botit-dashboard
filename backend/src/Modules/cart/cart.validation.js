import Joi from "joi";
import { generalField } from "../../Middlewares/validation.middleware.js";

export const addToCart = Joi.object({
  productId: generalField.id.required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const updateCartItem = Joi.object({
  productId: generalField.id.required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const removeFromCart = Joi.object({
  productId: generalField.id.required(),
});
