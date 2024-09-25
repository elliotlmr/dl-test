import { Hono } from "hono";
import { users } from "../schemas/users";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Env } from "..";
import { bearerAuth } from "hono/bearer-auth";
import { deleteCookie, setCookie } from "hono/cookie";
import { eq } from "drizzle-orm";

const auth = new Hono<{ Bindings: Env }>();

auth.post("/register", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { email, password, admin } = await c.req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log(email, password, admin);
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role: admin === true ? "admin" : "guest",
      })
      .returning({ id: users.id, role: users.role });

    console.log("User created !", newUser[0]);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser[0].id, email: email, role: newUser[0].role },
      c.env.JWT_SECRET,
      {
        expiresIn: c.env.JWT_EXPIRES_IN,
      }
    );

    console.log("Token generated !", token);

    setCookie(c, "who-s-the-good-doge", token, {
      httpOnly: true,
      secure: c.env.ENVIRONMENT === "development" ? false : true,
      sameSite: "None",
    });

    console.log("User logged !");

    return c.json({ message: "User registered successfully" }, 201);
  } catch (error) {
    return c.json(
      { error: "User already exists or error occurred", message: error },
      400
    );
  }
});

auth.post("/login", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { email, password } = await c.req.json();

  // Find user by email
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return c.json({ error: "Invalid email or password" }, 400);
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user[0].password);

  if (!validPassword) {
    return c.json({ error: "Invalid email or password" }, 400);
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user[0].id, email: email, role: user[0].role },
    c.env.JWT_SECRET,
    {
      expiresIn: c.env.JWT_EXPIRES_IN,
    }
  );

  setCookie(c, "who-s-the-good-doge", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return c.json({ message: `User authenticated !` });
});

auth.post("/logout", (c) => {
  deleteCookie(c, "who-s-the-good-doge");
  return c.json({ message: "User disconnected" });
});

export default auth;
