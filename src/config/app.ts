import { Context, Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import userRoutes from "@/Routes/userRoutes";
import AppError from "@/utils/AppError";

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

app.onError((err, c: Context) => {
  const statusCode: StatusCode = (
    err instanceof AppError ? err.statusCode : 500
  ) as StatusCode;
  const message =
    err instanceof AppError ? err.message : "Internal Server Error";

  return c.json(
    {
      status: statusCode,
      message: message,
    },
    statusCode
  );
});
const PORT = process.env.PORT ?? 4000;

export default {
  port: PORT,
  fetch: app.fetch,
};
