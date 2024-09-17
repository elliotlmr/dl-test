import { Hono } from 'hono'
import { users } from './db/schema';
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// const database_url = process.env.DATABASE_URL!;

// const sql = neon(database_url)
// const db = drizzle(sql)

export interface Env {
  DATABASE_URL: string;
}

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
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
  return c.text('Hello Hono!')
})

app.get('/test', (c) => {
  return c.text('Hello Hono Test !')
})

export default app
