import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {

  if (err instanceof ApiError) {

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: null,
    });
  }

  console.error("Unhandled Error:", err.stack);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error. Please try again later.",
    errors: [],
    data: null,
  });
};

export { errorHandler };
