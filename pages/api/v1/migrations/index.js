import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

const router = createRouter();

router.get(getMigrationsHandler);
router.post(postMigrationsHandler);

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

async function getMigrationsHandler(req, res) {
  try {
    const { defaultMigrationOption } = await dbClient();
    const pendingMigrations = await migrationRunner(defaultMigrationOption);
    return res.status(200).json(pendingMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function postMigrationsHandler(req, res) {
  const { defaultMigrationOption } = await dbClient();
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationOption,
    dryRun: false,
  });
  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }
  return res.status(200).json(migratedMigrations);
}

async function dbClient() {
  const dbClient = await database.getNewClient();
  const defaultMigrationOption = {
    dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return { defaultMigrationOption };
}
