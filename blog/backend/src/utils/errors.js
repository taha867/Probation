// Simple application error class that carries a machine-readable code
// plus the HTTP status code to use. The code should match a key in errorMessages.
export class AppError extends Error { //Error is the built-in parent class for all errors in JavaScript.(stack) ---> A text trace showing where the error happened.
  /**
   * @param {string} code - Machine-readable error code (must match errorMessages key)
   * @param {number} statusCode - HTTP status code (e.g. httpStatus.UNAUTHORIZED)
   */
  constructor(code, statusCode) {
    //You pass the error code to the parent Error
    super(code);
    this.name = "AppError"; //Useful for logging or debugging to see exactly which error type occurred.
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Helper to handle AppError in controllers in a consistent way.
// Returns true if it handled the error and sent a response.
export const handleAppError = (err, res, errorMessages) => {
  if (!(err instanceof AppError)) return false; //if err is an AppError, send a proper HTTP response and return true. Otherwise return false so other handlers can continue.


  const message = errorMessages[err.code] || err.code;
  const status = err.statusCode || 500;

  res.status(status).send({ data: { message } });
  return true;
};

