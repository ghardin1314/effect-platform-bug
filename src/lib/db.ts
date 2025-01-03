import { SqlClient } from "@effect/sql";
import { PgClient } from "@effect/sql-pg";
import { Effect, pipe, Redacted } from "effect";

export const SqlLive = PgClient.layer({
  username: "myuser",
  password: Redacted.make("mypassword"),
  host: "localhost",
  port: 5432,
  database: "myapp",
});

const program = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const people = yield* sql<{
    readonly id: number;
    readonly name: string;
  }>`SELECT id, name FROM people`;

  yield* Effect.log(`Got ${people.length} results!`);
});

pipe(program, Effect.provide(SqlLive), Effect.runPromise);
