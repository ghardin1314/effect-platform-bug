import { LayerLive } from "@/lib/db"
import { rpcRoute } from "@/lib/rpc"
import { HttpRouter, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { HttpRpcRouter } from "@effect/rpc-http"
import { Layer } from "effect"
import { createServer } from "http"


const HttpLive = HttpRouter.empty.pipe(
  HttpRouter.post("/api/rpc", rpcRoute),
  HttpServer.serve(),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
  Layer.provide(LayerLive)
)

NodeRuntime.runMain(Layer.launch(HttpLive))