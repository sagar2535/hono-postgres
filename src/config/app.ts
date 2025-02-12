import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import userRoutes from "../Routes/userRoutes";
import AppError from "../utils/AppError";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(logger());

app.get("/", (c: Context) => {
  return c.text("Hello Hono js!");
});

// ✅ Mount User Routes
app.route("/api/v1/users", userRoutes);

// ✅ Catch-all route for unknown paths
app.all("*", (c: Context) => {
  throw new AppError(`Cannot find ${c.req.url} on this server`, 404);
});

export default {
  port: 4000,
  fetch: app.fetch,
};
