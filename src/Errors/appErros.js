class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode || 500; //Code HTTP
    this.code = code || "SERVER_ERROR"; //Code interne
    this.name = this.constructor.name; //Nom de la classe
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message || "Invalid input", 400, "VALIDATION_ERROR");
  }
}

class AuthError extends AppError {
  constructor(message) {
    super(message || "Unauthorized", 401, "AUTH_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || "Not found", 404, "NOT_FOUND");
  }
}

module.exports = { AuthError, ValidationError, NotFoundError };
