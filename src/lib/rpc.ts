import { Rpc, RpcRouter } from "@effect/rpc";
import { HttpRpcRouter } from "@effect/rpc-http";
import { SqlClient } from "@effect/sql";
import { Effect, Schema } from "effect";
import { getPeople } from "./drizzle";

export class PersonList extends Schema.TaggedRequest<PersonList>()(
  "PersonList",
  {
    failure: Schema.Never,
    success: Schema.Array(Schema.Any),
    payload: {},
  }
) {}

const PersonListProc = Rpc.effect(PersonList, () =>
  Effect.gen(function* () {
    const people = yield* getPeople;

    return people;
  }).pipe(Effect.catchAll(Effect.die))
);

export class PersonListRaw extends Schema.TaggedRequest<PersonListRaw>()(
  "PersonListRaw",
  {
    failure: Schema.Never,
    success: Schema.Array(Schema.Any),
    payload: {},
  }
) {}

const PersonListRawProc = Rpc.effect(PersonListRaw, () =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const people = yield* sql<{
      readonly id: number;
      readonly name: string;
    }>`SELECT id, name FROM people`;

    return people;
  }).pipe(Effect.catchAll(Effect.die))
);

export class DeletePeople extends Schema.TaggedRequest<DeletePeople>()(
  "DeletePeople",
  {
    failure: Schema.Never,
    success: Schema.Any,
    payload: {},
  }
) {}

const DeletePeopleProc = Rpc.effect(DeletePeople, () =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    console.log("Deleting people");

    yield* sql`DELETE FROM people`;

    return {};
  }).pipe(Effect.catchAll(Effect.die))
);

export const rpcRouter = RpcRouter.make(
  PersonListProc,
  PersonListRawProc,
  DeletePeopleProc
);

export const rpcRoute = HttpRpcRouter.toHttpApp(rpcRouter);
