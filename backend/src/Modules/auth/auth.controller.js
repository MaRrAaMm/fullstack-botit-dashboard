import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { asyncHandler } from "../../utils/error/index.js";
import { isValid } from "../../Middlewares/validation.middleware.js";
import { isAuthenticate } from "../../Middlewares/auth.middleware.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
  },
});

const router = Router();

router.post(
  "/register",
  authLimiter,
  isValid(authValidation.register),
  asyncHandler(authService.register)
);

router.post(
  "/login",
  authLimiter,
  isValid(authValidation.login),
  asyncHandler(authService.login)
);

router.get(
  "/me",
  asyncHandler(isAuthenticate),
  asyncHandler(authService.getMe)
);

router.post(
  "/logout",
  asyncHandler(authService.logout)
);

export default router;
