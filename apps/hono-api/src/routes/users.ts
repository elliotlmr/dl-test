import { Hono } from "hono";
import { Env } from "..";
import { isAdmin } from "../middlewares/auth";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users as usersTable } from "../schemas/users";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const users = new Hono<{ Bindings: Env }>();

//? These routes are for Admin only
users.use("/*", (c, next) => isAdmin(c, next));

//? Create a new user
users.post("/", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { email, password, admin } = await c.req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
    .insert(usersTable)
    .values({
      email,
      password: hashedPassword,
      role: admin ? "admin" : "guest",
    })
    .returning({ id: usersTable.id });

  if (newUser.length === 0) {
    return c.json({ error: "Error creating user :/" }, 400);
  }
  return c.json({ message: "Create a new user !" }, 200);
});

//? Retrieve a list of all users
users.get("/", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const users = await db
    .select({
      id: usersTable.id,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
    })
    .from(usersTable);

  if (users.length === 0) {
    return c.json({ error: "No doges in the park :(" }, 400);
  }
  return c.json({ users }, 200);
});

//? Add a friend to a user's friend list
users.post("/:id/friends/:friendId", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { id, friendId } = c.req.param();

  const user = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (user.length === 0) {
    return c.json({ error: "User account is missing !" }, 400);
  }

  const friend = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, friendId));

  if (friend.length === 0) {
    return c.json({ error: "Friend account is missing !" }, 400);
  }

  return c.json({ message: "Add a friend to a user's friend list !" }, 200);
});

//? Remove a friend from a user’s friend list
users.delete("/:id/friends/:friendId", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { id, friendId } = c.req.param();

  return c.json(
    { message: "Delete a friend from a user's friend list !" },
    200
  );
});

//? Retrieve a list of all friends for a given user
users.get("/:id/friends", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  return c.json({ message: "List of all friends of user !" }, 200);
});

export default users;
