export class AuthorizationError extends Error {
  readonly status = 403;
  readonly code = "FORBIDDEN";

  constructor(message = "You are not authorized to perform this action") {
    super(message);
    this.name = "AuthorizationError";
  }
}
