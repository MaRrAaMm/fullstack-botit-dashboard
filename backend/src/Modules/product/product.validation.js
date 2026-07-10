import Joi from "joi";
import { generalField } from "../../Middlewares/validation.middleware.js";

export const createProduct = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().min(3).max(50).required(),

});

export const updateProduct = Joi.object({
  id: generalField.id.required(),
  name: Joi.string().min(3).max(100),
  price: Joi.number().positive(),
  category: Joi.string().min(3).max(50),
});

export const getProduct = Joi.object({
  id: generalField.id.required(),
});

export const deleteProduct = Joi.object({
  id: generalField.id.required(),
});