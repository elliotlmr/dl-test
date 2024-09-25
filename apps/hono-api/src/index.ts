import { Hono } from "hono";
import { users } from "./schemas/users";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import authRoutes from "./routes/auth";
import friendsRoutes from "./routes/friends";
import usersRoutes from "./routes/users";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import { isAuthenticated } from "./middlewares/auth";

// const database_url = process.env.DATABASE_URL!;

// const sql = neon(database_url)
// const db = drizzle(sql)

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

//? Global setup
app.use(csrf({ origin: ["localhost:3000"] }));

app.notFound((c) => {
  return c.text("Doge not found :(", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Doge went wrong !", 500);
});

app.get("/", async (c) => {
  return c.text("Welcome to Hono + Drizzle + Neon App ! API coding :D");
});

//? Routes / middlewares
app.route("/auth", authRoutes);

app.use("/api/*", (c, next) => isAuthenticated(c, next));

app.route("/api/friends", friendsRoutes);
app.route("/api/users", usersRoutes);

export default app;
