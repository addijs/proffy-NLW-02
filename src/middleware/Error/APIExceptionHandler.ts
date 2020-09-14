import { APIError } from "./APIError";

export class InternalError extends APIError {
  constructor(action: string) {
    super(500, `Unexpected error while ${action}`);
  }
}

export class NotFoundError extends APIError {
  constructor(entity: string) {
    entity = entity[0].toUpperCase() + entity.slice(1);
    super(404, `${entity} not found`);
  }
}

export class WrongPasswordError extends APIError {
  constructor() {
    super(401, 'Wrong password');
  }
}

export class InvalidTokenError extends APIError {
  constructor(errorMessage: string) {
    super(403, `Invalid token: ${errorMessage}`);
  }
}

export class NotProvidedTokenError extends APIError {
  constructor() {
    super(403, 'Token not provided');
  }
}