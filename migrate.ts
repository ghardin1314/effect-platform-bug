import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { PgMigrator } from "@effect/sql-pg";
import { Effect, Layer } from "effect";
import { fileURLToPath } from "node:url";
import { SqlLive } from "./src/lib/db";

const EnvLive = Layer.mergeAll(SqlLive, NodeContext.layer)

const program = PgMigrator.run({
  loader: PgMigrator.fromFileSystem(
    fileURLToPath(new URL("migrations", import.meta.url))
  ),
  // Where to put the `_schema.sql` file
  schemaDirectory: "./migrations",
}).pipe(Effect.provide(EnvLive));


NodeRuntime.runMain(program)
