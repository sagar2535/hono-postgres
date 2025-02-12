import { serve } from "bun";
import app from "./app";

const PORT = process.env.PORT || 4000;

serve({
  fetch: app.fetch,
  port: Number(PORT),
});

console.log(`🚀 Server running on http://localhost:${PORT}`);
