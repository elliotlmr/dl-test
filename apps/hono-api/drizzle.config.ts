import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/schemas/*",
  out: "./drizzle",
} satisfies Config;
