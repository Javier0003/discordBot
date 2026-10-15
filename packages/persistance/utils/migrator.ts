import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { join } from "path";
import env from "./env";

const migrationsFolder = join(__dirname, "../../drizzle/migrations");

export async function runMigration() {
  const migrationClient = postgres(env.migrateUrl ?? env.dbUrl, { max: 1 });

  await migrate(drizzle(migrationClient), {
    migrationsFolder,
  });

  await migrationClient.end();
}

runMigration();
