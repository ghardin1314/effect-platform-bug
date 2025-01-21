import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { PgClient } from "@effect/sql-pg";
import { Layer, Redacted } from "effect";

export const SqlLive = PgClient.layer({
  username: "postgres",
  password: Redacted.make("postgrespassword"),
  host: "localhost",
  port: 5433,
  database: "mydatabase",
});

export const LayerLive = Layer.provideMerge(PgDrizzle.layer, SqlLive);
