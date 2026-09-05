export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("um erro interno não esperado aconteceu", {
      cause,
    });

    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte do sistema";
    this.status_code = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message, statusCode }) {
    super(message || "Serviço indisponível no momento.", {
      cause,
    });

    this.name = "ServiceError";
    this.action =
      "Verifique se o serviço está disponível e tente novamente mais tarde.";
    this.status_code = statusCode || 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint.");

    this.name = "MethodNotAllowedError";
    this.action = "Verifique a documentação da API para métodos permitidos.";
    this.status_code = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.status_code,
    };
  }
}
