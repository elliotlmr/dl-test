import { Hono } from 'hono'
// import { neon } from '@neondatabase/serverless'
// import { drizzle } from 'drizzle-orm/neon-http'

// const database_url = process.env.DATABASE_URL!;

// const sql = neon(database_url)
// const db = drizzle(sql)

export interface Env {
  DATABASE_URL: string;
}

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/test', (c) => {
  return c.text('Hello Hono Test !')
})

export default app
