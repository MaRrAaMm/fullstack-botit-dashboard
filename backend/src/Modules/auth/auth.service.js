import { User } from "../../DB/models/user.model.js";
import { hash, compare } from "../../utils/hash/index.js";
import { generateToken } from "../../utils/token/index.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,
  path: "/",
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password: hash({ password }),
  });

  const token = generateToken({
    payload: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    options: {expiresIn: "1h"},
  });

  res.cookie("token", token, COOKIE_OPTIONS);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password", { cause: 401 });
  }
  const isMatch = compare({
    password,
    hashedPassword: user.password,
  });

  if (!isMatch) {
    throw new Error("Invalid email or password", { cause: 401 });
  }
  const token = generateToken({
    payload: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    options: {
      expiresIn: "1h",
    },
  });

  res.cookie("token", token, COOKIE_OPTIONS);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const getMe = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.authUser._id,
      name: req.authUser.name,
      email: req.authUser.email,
      role: req.authUser.role,
    },
  });
};

export const logout = async (req, res, next) => {
  res.clearCookie("token", { path: "/" });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
