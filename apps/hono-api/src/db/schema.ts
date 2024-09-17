import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstname: text('firstname'),
  lastname: text('lastname'),
  email: text('email'),
  password: text('password'),
});