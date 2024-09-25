import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export const isConnected = async (c: Context, next: Next) => {
  const token = c.req.header("authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ error: "Token is missing" }, 401);
  }

  try {
    const decoded = jwt.verify(token, c.env.JWT_SECRET);
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 403);
  }
};
