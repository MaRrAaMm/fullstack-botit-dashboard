import Joi from "joi";
import { Types } from "mongoose";

export const isValid = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== "function") {
      throw new Error("Invalid schema");
    }

    const data = {...req.body,...req.params,...req.query,};
    const { error } = schema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      return next(new Error(messages, { cause: 400 }));
    }
    next();
  };
};

export const generalField = {
  id: Joi.custom(isValidId),
};

function isValidId(value, helpers) {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
}