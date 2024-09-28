import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';
import { User } from '@repo/types/users';

export const isAuthenticated = async (c: Context, next: Next) => {
  const token = getCookie(c, 'who-s-the-good-doge');

  if (!token) {
    return c.json({ error: 'User not authenticated !' }, 401);
  }

  try {
    const decoded = jwt.verify(token, c.env.JWT_SECRET) as User;
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const isAdmin = async (c: Context, next: Next) => {
  const token = getCookie(c, 'who-s-the-good-doge');

  if (!token) {
    return c.json({ error: 'Token is missing' }, 401);
  }

  try {
    const decoded = jwt.verify(token, c.env.JWT_SECRET) as User;
    c.set('user', decoded);

    if (decoded.role && decoded.role !== 'admin') {
      return c.json({ error: 'Invalid role' }, 403);
    }
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 403);
  }
};
