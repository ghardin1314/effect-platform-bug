import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { PgClient } from "@effect/sql-pg";
import { Layer, Redacted } from "effect";

export const SqlLive = PgClient.layer({
  username: "myuser",
  password: Redacted.make("mypassword"),
  host: "localhost",
  port: 5433,
  database: "myapp",
});

export const LayerLive = Layer.provideMerge(PgDrizzle.layer, SqlLive);
