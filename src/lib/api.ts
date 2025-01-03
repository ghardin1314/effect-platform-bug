import { HttpApp, HttpRouter, HttpServerResponse } from "@effect/platform";
import { SqlClient } from "@effect/sql";
import { Effect } from "effect";
import { LayerLive } from "./db";
import { getPeople } from "./drizzle";
import { rpcRoute } from "./rpc";

// Define the router with some routes
const router = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/api/people",
    Effect.gen(function* () {
      const people = yield* getPeople;

      return yield* HttpServerResponse.json(people);
    })
  ),
  HttpRouter.del(
    "/api/people",
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;

      console.log("Deleting people");

      yield* sql`DELETE FROM people`;
      return yield* HttpServerResponse.text("People deleted");
    })
  ),
  HttpRouter.post("/api/rpc", rpcRoute)
);

// Convert the router to a web handler
// const handler: (request: Request) => Promise<Response>
export const handler = HttpApp.toWebHandler(
  router.pipe(Effect.provide(LayerLive))
);
