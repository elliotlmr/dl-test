import { Hono } from "hono";
import { users } from "../schemas/users";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Env } from "..";
import { bearerAuth } from "hono/bearer-auth";
import { setCookie } from "hono/cookie";

const auth = new Hono<{ Bindings: Env }>();

auth.post("/register", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { email, password } = await c.req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser[0].id, email: email },
      c.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return c.json(
      { message: "User registered successfully", setCookie: {} },
      201
    );
  } catch (error) {
    return c.json({ error: "User already exists or error occurred" }, 400);
  }
});

auth.post("/login", (c) => {
  return c.text("Login route");
});

auth.post("/logout", (c) => {
  return c.text("Login route");
});

export default auth;
