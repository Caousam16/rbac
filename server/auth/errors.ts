export class AuthenticationError extends Error {
  readonly status = 401;
  readonly code = "UNAUTHENTICATED";

  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}
