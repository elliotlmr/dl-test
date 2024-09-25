import { Hono } from "hono";
import { users } from "./schemas/users";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import auth from "./routes/auth";
import friends from "./routes/friends";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import { isConnected } from "./middlewares/auth";

// const database_url = process.env.DATABASE_URL!;

// const sql = neon(database_url)
// const db = drizzle(sql)

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(csrf({ origin: ["localhost:3000"] }));

app.notFound((c) => {
  return c.text("Doge not found :(", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Doge went wrong !", 500);
});

app.get("/", async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const result = await db.select().from(users);
    return c.json({
      result,
    });
  } catch (error) {
    console.log(error);
    return c.json(
      {
        error,
      },
      400
    );
  }
  return c.text("Hello Hono!");
});

app.get("/test", (c) => {
  return c.text("Hello Hono Test !");
});

app.get("/test/:name", (c) => {
  const name = c.req.param("name");
  return c.text(`Hello Hono Test ! ${name}`);
});

app.get("/name/:name/comment/:comment", (c) => {
  const { name, comment } = c.req.param();
  return c.text(`Hello Hono Test ! ${name} ${comment}`);
});

app.route("/auth", auth);

app.use("/api/*", (c, next) => isConnected(c, next));

app.route("/api/friends", friends);

export default app;
