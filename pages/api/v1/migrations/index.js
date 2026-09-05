import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const dbClient = await database.getNewClient();
  try {
    const { defaultMigrationOption } = await migrationsOptions();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dbClient,
    });
    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(req, res) {
  const dbClient = await database.getNewClient();
  try {
    const { defaultMigrationOption } = await migrationsOptions();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOption,
      dryRun: false,
      dbClient,
    });
    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }
    return res.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}

async function migrationsOptions() {
  const defaultMigrationOption = {
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return { defaultMigrationOption };
}
