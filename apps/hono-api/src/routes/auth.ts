import { Hono } from 'hono';
import { users } from '../schemas/users';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Env } from '..';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { and, eq } from 'drizzle-orm';
import { User } from '@repo/types/users';

const auth = new Hono<{ Bindings: Env }>();

auth.post('/register', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { username, email, password, admin } = await c.req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role: admin === true ? 'admin' : 'guest',
      })
      .returning({ id: users.id, role: users.role });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser[0].id, email: email, role: newUser[0].role },
      c.env.JWT_SECRET,
      {
        expiresIn: c.env.JWT_EXPIRES_IN,
      }
    );

    setCookie(c, 'who-s-the-good-doge', token, {
      httpOnly: true,
      secure: c.env.ENVIRONMENT === 'development' ? false : true,
      sameSite: c.env.ENVIRONMENT === 'development' ? 'Lax' : 'None',
    });

    return c.json(
      { message: 'User registered successfully', user: newUser[0] },
      201
    );
  } catch (error) {
    return c.json(
      { error: 'User already exists or error occurred', message: error },
      400
    );
  }
});

auth.post('/login', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { email, password } = await c.req.json();

  try {
    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 400);
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return c.json({ error: 'Invalid email or password' }, 400);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user[0].id, email: email, role: user[0].role },
      c.env.JWT_SECRET,
      {
        expiresIn: c.env.JWT_EXPIRES_IN,
      }
    );

    setCookie(c, 'who-s-the-good-doge', token, {
      httpOnly: true,
      secure: c.env.ENVIRONMENT === 'development' ? false : true,
      sameSite: c.env.ENVIRONMENT === 'development' ? 'Lax' : 'None',
    });

    //? Recreate a new object without password for the response
    const { password: filtered, ...safeUser } = user[0];

    return c.json({ user: safeUser }, 200);
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'An error occured during login' }, 500);
  }
});

auth.post('/loginWithCookie', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const token = getCookie(c, 'who-s-the-good-doge');

  if (!token) {
    return c.json({ error: 'No token found !' }, 401);
  }

  const decoded = jwt.verify(token, c.env.JWT_SECRET) as User;
  // Find user by email
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, decoded.id), eq(users.email, decoded.email)))
    .limit(1);

  if (user.length === 0) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  //? Recreate a new object without password for the response
  const { password: filtered, ...safeUser } = user[0];

  return c.json({ message: `User authenticated !`, user: safeUser });
});

auth.post('/logout', (c) => {
  deleteCookie(c, 'who-s-the-good-doge');
  return c.json({ message: 'User disconnected' });
});

export default auth;
