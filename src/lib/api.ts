import { HttpApp, HttpRouter, HttpServerResponse } from "@effect/platform";

// Define the router with some routes
const router = HttpRouter.empty.pipe(
  HttpRouter.get("/api/", HttpServerResponse.text("content 1")),
  HttpRouter.get("/api/foo", HttpServerResponse.text("content 2"))
);

// Convert the router to a web handler
// const handler: (request: Request) => Promise<Response>
export const handler = HttpApp.toWebHandler(router);
