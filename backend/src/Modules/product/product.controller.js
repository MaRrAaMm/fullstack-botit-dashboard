import { Router } from "express";
import {isAuthenticate} from "../../Middlewares/auth.middleware.js";
import { isAuthorized } from "../../Middlewares/authorization.middleware.js";
import * as productService from "./product.service.js";
import * as productValidation from "./product.validation.js";
import { asyncHandler } from "../../utils/error/index.js";
import { isValid } from "../../Middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/",
  isAuthenticate,
  isAuthorized("admin"),
  isValid(productValidation.createProduct),
  asyncHandler(productService.createProduct)
);

router.get("/",
  asyncHandler(productService.getAllProducts)
);

router.get(
  "/:id",
  isValid(productValidation.getProduct),
  asyncHandler(productService.getProductById)
);

router.put(
  "/:id",
  isAuthenticate,
  isAuthorized("admin"),
  isValid(productValidation.updateProduct),
  asyncHandler(productService.updateProduct)
);

router.delete(
  "/:id",
  isAuthenticate,
  isAuthorized("admin"),
  isValid(productValidation.deleteProduct),
  asyncHandler(productService.deleteProduct)
);

export default router;