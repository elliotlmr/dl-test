import { Hono } from 'hono';
import { Env, Variables } from '..';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users as usersTable } from '../schemas/users';

const kpis = new Hono<{ Variables: Variables; Bindings: Env }>();

kpis.get('/number-of-users', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const users = await db.select({ id: usersTable.id }).from(usersTable);

  const population = users.length;

  return c.json({ population });
});

kpis.get('/average-friends-per-user', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const users = await db
    .select({ friends: usersTable.friends })
    .from(usersTable);

  const totalFriends = users.reduce(
    (acc, user) => acc + user.friends.length,
    0
  );

  let average = totalFriends / users.length;

  console.log('totaaaal', totalFriends, 'averaaage', average, users.length);

  return c.json({ average });
});

export default kpis;
