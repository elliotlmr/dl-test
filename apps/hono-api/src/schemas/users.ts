import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  username: text('username').notNull().unique(),
  firstname: text('firstname'),
  lastname: text('lastname'),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  friends: text('friends').array().notNull().default([]),
  blacklist: text('blacklist').array().notNull().default([]),
  role: text('role').notNull().default('guest'),
});

export const friendRequests = pgTable('friend_requests', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  friend_id: uuid('friend_id')
    .references(() => users.id)
    .notNull(),
  status: text('status').notNull().default('pending'), // Can be 'pending', 'accepted', or 'declined'
  treated_at: timestamp('treated_at'),
});
