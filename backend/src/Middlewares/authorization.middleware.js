export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.authUser.role)) {
      throw new Error("Unauthorized", { cause: 403 });
    }

    next();
  };
};