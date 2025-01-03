# Effect RPC & SQL Bug

There is some strange bug with connecting to the SQL layer when using the `toWebHandler` function and RPC router.

## Web Handler

To reproduce:

1. install `pnpm install`
2. run `docker compose up`
3. run `pnpx tsx migrate.ts`
4. run `pnpm dev`

To get a valid response, using the normal HttpRoute use:

```bash
curl -X GET http://localhost:3000/api/people
```

To get an error, using the RPC route use:

```bash
curl -X POST http://localhost:3000/api/rpc \
     -H "Content-Type: application/json" \
     -d '[
           {
             "request": { "_tag": "PersonList" },
             "traceId": "traceId",
             "spanId": "spanId",
             "sampled": true,
             "headers": {}
           }
         ]'
```

It is also not a drizzle issue, as the same error occurs when using the raw SQL query.

```bash
curl -X POST http://localhost:3000/api/rpc \
     -H "Content-Type: application/json" \
     -d '[
           {
             "request": { "_tag": "PersonListRaw" },
             "traceId": "traceId",
             "spanId": "spanId",
             "sampled": true,
             "headers": {}
           }
         ]'
```

## Server

Works fine when using a normal http server.

```bash
pnpx tsx server.ts
```

```bash
curl -X POST http://localhost:3000/api/rpc \
     -H "Content-Type: application/json" \
     -d '[
           {
             "request": { "_tag": "PersonList" },
             "traceId": "traceId",
             "spanId": "spanId",
             "sampled": true,
             "headers": {}
           }
         ]'
```
