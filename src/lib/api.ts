import { HttpApp, HttpRouter, HttpServerResponse } from "@effect/platform";
import { SqlClient } from "@effect/sql";
import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { Effect, Layer } from "effect";
import { SqlLive } from "./db";
import { getPeople } from "./drizzle";
import { rpcRoute } from "./rpc";

const LayerLive = Layer.provideMerge(PgDrizzle.layer, SqlLive);

// Define the router with some routes
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/api/",
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      const people = yield* sql<{
        readonly id: number;
        readonly name: string;
      }>`SELECT id, name FROM people`;

      return yield* HttpServerResponse.json(people);
    })
  ),
  HttpRouter.get(
    "/api/people",
    Effect.gen(function* () {
      const people = yield* getPeople;

      return yield* HttpServerResponse.json(people);
    })
  ),
  HttpRouter.post("/api/rpc", rpcRoute),
);

// Convert the router to a web handler
// const handler: (request: Request) => Promise<Response>
export const handler = HttpApp.toWebHandler(
  router.pipe(Effect.provide(LayerLive))
);
