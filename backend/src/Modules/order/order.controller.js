import { Router } from "express";
import { isAuthenticate } from "../../Middlewares/auth.middleware.js";
import { isAuthorized } from "../../Middlewares/authorization.middleware.js";
import * as orderService from "./order.service.js";
import * as orderValidation from "./order.validation.js";
import { asyncHandler } from "../../utils/error/index.js";
import { isValid } from "../../Middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/",
  isAuthenticate,
  isAuthorized("admin"),
  isValid(orderValidation.createOrder),
  asyncHandler(orderService.createOrder)
);

router.post(
  "/checkout",
  isAuthenticate,
  asyncHandler(orderService.checkout)
);

router.get(
  "/user/me",
  isAuthenticate,
  asyncHandler(orderService.getUserOrders)
);

router.get(
  "/",
  isAuthenticate,
  isValid(orderValidation.getAllOrders),
  asyncHandler(orderService.getAllOrders)
);

router.get(
  "/:id",
  isAuthenticate,
  isValid(orderValidation.getOrder),
  asyncHandler(orderService.getOrderById)
);

router.put(
  "/:id",
  isAuthenticate,
  isAuthorized("admin"),
  isValid(orderValidation.updateOrder),
  asyncHandler(orderService.updateOrder)
);

router.delete(
  "/:id",
  isAuthenticate,
  isAuthorized("admin"),
  isValid(orderValidation.deleteOrder),
  asyncHandler(orderService.deleteOrder)
);

export default router;