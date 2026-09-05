import { createRouter } from "next-connect";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(_, res) {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandler(error, _, res) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.log("\n Erro dentro do catch do next-connect");
  console.error(publicErrorObject);

  res.status(500).json(publicErrorObject);
}

async function getHandler(_, res) {
  const updatedAt = new Date().toISOString();

  const databaseVersionRequest = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionRequest.rows[0].server_version;

  const databaseMaxConnetionsRequest = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnetionsRequest.rows[0].max_connections,
    10,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseConnectionsOpenedRequest = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        connections_opened: databaseConnectionsOpenedRequest.rows[0].count,
      },
    },
  });
}
