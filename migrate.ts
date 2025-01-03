import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { PgMigrator } from "@effect/sql-pg";
import { Effect, Layer, pipe } from "effect";
import { fileURLToPath } from "node:url";
import { SqlLive } from "./src/lib/db";

const MigratorLive = PgMigrator.layer({
  loader: PgMigrator.fromFileSystem(
    fileURLToPath(new URL("migrations", import.meta.url))
  ),
  // Where to put the `_schema.sql` file
  schemaDirectory: "./migrations",
}).pipe(Layer.provide(SqlLive));

const EnvLive = Layer.mergeAll(SqlLive, MigratorLive).pipe(
  Layer.provide(NodeContext.layer)
);

const program = Effect.gen(function* () {});

pipe(program, Effect.provide(EnvLive), NodeRuntime.runMain);
