import { Hono } from 'hono';
import authRoutes from './routes/auth';
import friendsRoutes from './routes/friends';
import usersRoutes from './routes/users';
import { isAuthenticated } from './middlewares/auth';
import { cors } from 'hono/cors';
import kpisRoutes from './routes/kpis';
import { User } from '@repo/types/users';

export interface Variables {
  user: User;
}

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  ENVIRONMENT: string;
}

const app = new Hono<{ Variables: Variables; Bindings: Env }>();

//? Global setup
app.use(
  '/*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://dl-test.pages.dev/',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
    credentials: true,
  })
);

app.notFound((c) => {
  return c.text('Doge not found :(', 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text('Doge went wrong !', 500);
});

app.get('/', async (c) => {
  return c.text('Welcome to Hono + Drizzle + Neon App ! API coding :D');
});

//? Routes / middlewares
app.route('/auth', authRoutes);

app.use('/api/*', (c, next) => isAuthenticated(c, next));

app.route('/api/friends', friendsRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/kpis', kpisRoutes);

export default app;
