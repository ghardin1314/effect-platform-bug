import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { Effect } from "effect";

const peopleTable = pgTable("people", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const getPeople = Effect.gen(function* () {
  const db = yield* PgDrizzle.PgDrizzle;

  return yield* db.select().from(peopleTable as any);
});
