import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { Env } from "..";
import { friendRequests, users } from "../schemas/users";
import { and, eq, sql } from "drizzle-orm";

const friends = new Hono<{ Bindings: Env }>();

//? Send a friend request
friends.post("/add", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { userId, friendId } = await c.req.json();

  if (userId === friendId) {
    return c.json(
      { error: "You cannot send a friend request to yourself" },
      400
    );
  }

  // Check if a friend request already exists
  const existingRequest = await db
    .select()
    .from(friendRequests)
    .where(
      and(
        eq(friendRequests.user_id, userId),
        eq(friendRequests.friend_id, friendId)
      )
    );

  if (existingRequest.length > 0) {
    return c.json({ message: "Friend request already sent" }, 400);
  }

  // Insert a new (pending) friend request
  await db
    .insert(friendRequests)
    .values({ user_id: userId, friend_id: friendId });

  return c.json({ message: "Friend request sent" }, 201);
});

//? Accept a friend request
friends.post("/accept", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const { requestId } = await c.req.json();

  // Get the request
  const request = await db
    .select()
    .from(friendRequests)
    .where(eq(friendRequests.id, requestId));

  if (request.length === 0 || request[0].status !== "pending") {
    return c.json({ error: "Invalid or already processed request" }, 400);
  }

  const { user_id, friend_id } = request[0];

  // Update the friends list for both users
  await db.transaction(async (tx) => {
    // Update user's friendlist
    const user = await tx
      .select({ userFriends: users.friends })
      .from(users)
      .where(eq(users.id, user_id));
    const { userFriends } = user[0];
    const updatedUserFriends = userFriends.push(friend_id);

    return updatedUserFriends;
    // await tx
    //   .update(users)
    //   .set({ friends: updatedUserFriends })
    //   .where(eq(users.id, user_id));
    // // Update new friend's friendlist
    // const friend = await tx.select().from(users).where(eq(users.id, friend_id))
    // await tx
    //   .update(users)
    //   .set({ friends: sql`array_append(${users.friends}, ${user_id})` })
    //   .where(eq(users.id, friend_id));
    // Update request status
    await tx
      .update(friendRequests)
      .set({ status: "accepted" })
      .where(eq(friendRequests.id, requestId));
  });
});

friends.get("/requests", (c) => {
  return c.text("Helloooo !");
});

export default friends;
