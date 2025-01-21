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
const {handler: effectHandler, close} = HttpApp.toWebHandlerLayer(router, LayerLive);

process.on("SIGINT", () => {
  close().then(() => {
    process.exit(0);
  })
})
process.on("SIGTERM", () => {
  close().then(() => {
    process.exit(0);
  })
})

// to ensure the second argument is not used
// Will be fixed in the next version of Effect
export const handler = (request: Request) => effectHandler(request);
