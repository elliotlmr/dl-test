import { sql } from "drizzle-orm";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  firstname: text("firstname"),
  lastname: text("lastname"),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  friends: text("friends").array().notNull().default([]),
  blacklist: text("blacklist").array().notNull().default([]),
});

export const friendRequests = pgTable("friend_requests", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  friend_id: uuid("friend_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").notNull().default("pending"), // Can be 'pending', 'accepted', or 'declined'
});
