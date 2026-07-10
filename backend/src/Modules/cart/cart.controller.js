import { Router } from "express";
import { isAuthenticate } from "../../Middlewares/auth.middleware.js";
import * as cartService from "./cart.service.js";
import * as cartValidation from "./cart.validation.js";
import { asyncHandler } from "../../utils/error/index.js";
import { isValid } from "../../Middlewares/validation.middleware.js";

const router = Router();

router.get(
  "/",
  isAuthenticate,
  asyncHandler(cartService.getCart)
);

router.post(
  "/add",
  isAuthenticate,
  isValid(cartValidation.addToCart),
  asyncHandler(cartService.addToCart)
);

router.put(
  "/update",
  isAuthenticate,
  isValid(cartValidation.updateCartItem),
  asyncHandler(cartService.updateCartItem)
);

router.delete(
  "/remove/:productId",
  isAuthenticate,
  isValid(cartValidation.removeFromCart),
  asyncHandler(cartService.removeFromCart)
);

router.delete(
  "/clear",
  isAuthenticate,
  asyncHandler(cartService.clearCart)
);

export default router;
