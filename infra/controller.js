import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

function onNoMatchHandler(_, res) {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandler(error, _, res) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  res.status(publicErrorObject.status_code).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
