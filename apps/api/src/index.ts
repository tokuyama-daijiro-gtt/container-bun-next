import { serve } from "@hono/node-server";
import { app } from "./app";

const hostname = process.env.API_HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.API_PORT ?? "3001", 10);

serve({ fetch: app.fetch, hostname, port }, (info) => {
  console.log(`API listening on http://${info.address}:${info.port}`);
});
