export const globalError = (err, req, res, next) => {
  return res.status(err.cause || 500).json({
    success: false,
    message: err.message,
    ...(process.env.MODE === "DEV" && { stack: err.stack }),
  });
};