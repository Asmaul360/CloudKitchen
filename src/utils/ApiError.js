class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    stack = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.stack = stack;
    this.errors = errors;
    this.data = null;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrack(this, this.constructor);
    }
  }
}
export default ApiError;
