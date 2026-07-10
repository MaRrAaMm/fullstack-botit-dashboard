import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/verify-token.js";

export const isAuthenticate = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new Error("Token is required", { cause: 401 });
  }

  const decoded = verifyToken({ token });
  if (!decoded || decoded.error) {
    throw new Error("Invalid or expired token", { cause: 401 });
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }

  req.authUser = user;
  next();
};
