import { Hono } from 'hono';
import { Env } from '..';
import { isAdmin } from '../middlewares/auth';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { friendRequests, users as usersTable } from '../schemas/users';
import bcrypt from 'bcryptjs';
import { and, eq, getTableColumns, inArray, or } from 'drizzle-orm';

const users = new Hono<{ Bindings: Env }>();

//? These routes are for Admin only
users.use('/*', (c, next) => isAdmin(c, next));

//? Create a new user
users.post('/', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { username, email, password, admin } = await c.req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
    .insert(usersTable)
    .values({
      username,
      email,
      password: hashedPassword,
      role: admin ? 'admin' : 'guest',
    })
    .returning({ id: usersTable.id });

  if (newUser.length === 0) {
    return c.json({ error: 'Error creating user :/' }, 400);
  }

  return c.json({ message: 'Create a new user !', user: newUser[0] }, 201);
});

//? Retrieve a list of all users
users.get('/', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const users = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      firstname: usersTable.firstname,
      lastname: usersTable.lastname,
      email: usersTable.email,
      friends: usersTable.friends,
      role: usersTable.role,
    })
    .from(usersTable);

  if (users.length === 0) {
    return c.json({ error: 'No doges in the park :(' }, 400);
  }
  return c.json({ users }, 200);
});

//? Add a friend to a user's friend list
users.post('/:id/friends/:friendId', async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);

    const { id, friendId } = c.req.param();

    if (id === friendId) {
      return c.json({ error: "This doge can't be friend with itself !" }, 400);
    }

    const user = await db
      .select({ id: usersTable.id, friends: usersTable.friends })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (user.length === 0) {
      return c.json({ error: 'User account is missing !' }, 400);
    }

    const friend = await db
      .select({ id: usersTable.id, friends: usersTable.friends })
      .from(usersTable)
      .where(eq(usersTable.id, friendId));

    if (friend.length === 0) {
      return c.json({ error: 'Friend account is missing !' }, 400);
    }

    const userKnowsFriend = user[0].friends.find((entry) => entry === friendId);
    const friendKnowsUser = friend[0].friends.find((entry) => entry === id);

    if (userKnowsFriend && friendKnowsUser) {
      return c.json({ error: 'These doges already know each other !' }, 400);
    }

    if (!userKnowsFriend) {
      let newUserFriendlist = user[0].friends;
      newUserFriendlist.push(friendId);

      try {
        await db
          .update(usersTable)
          .set({ friends: newUserFriendlist })
          .where(eq(usersTable.id, id));
      } catch (err) {
        console.log(err);
        return c.json(
          { error: "Couldn't add friend to user's friendlist !" },
          400
        );
      }
    }

    if (!friendKnowsUser) {
      let newFriendFriendlist = friend[0].friends;
      newFriendFriendlist.push(id);

      try {
        await db
          .update(usersTable)
          .set({ friends: newFriendFriendlist })
          .where(eq(usersTable.id, friendId));
      } catch (err) {
        console.log(err);
        return c.json(
          { error: "Couldn't add friend to user's friendlist !" },
          400
        );
      }
    }

    //? If pending friend request exists, delete it
    const condition = () =>
      or(
        and(
          eq(friendRequests.user_id, user[0].id),
          eq(friendRequests.friend_id, friend[0].id)
        ),
        and(
          eq(friendRequests.user_id, friend[0].id),
          eq(friendRequests.friend_id, user[0].id)
        )
      );

    const pendingRequests = await db
      .select()
      .from(friendRequests)
      .where(condition());

    if (pendingRequests.length > 0) {
      await db.delete(friendRequests).where(condition());
    }

    return c.json({ message: 'These two doges are now friends <3' }, 200);
  } catch (err) {
    return c.json({ error: "Couldn't add friend to user's friendlist !" }, 400);
  }
});

//? Remove a friend from a user’s friend list
users.delete('/:id/friends/:friendId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { id, friendId } = c.req.param();

  const user = await db
    .select({ id: usersTable.id, friends: usersTable.friends })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (user.length === 0) {
    return c.json({ error: 'User account is missing !' }, 400);
  }

  const friend = await db
    .select({ id: usersTable.id, friends: usersTable.friends })
    .from(usersTable)
    .where(eq(usersTable.id, friendId));

  if (friend.length === 0) {
    return c.json({ error: 'Friend account is missing !' }, 400);
  }

  const userKnowsFriend = user[0].friends.find((entry) => entry === friendId);
  const friendKnowsUser = friend[0].friends.find((entry) => entry === id);

  if (!userKnowsFriend && !friendKnowsUser) {
    return c.json({ error: "These two doges don't know each other !" }, 400);
  }

  if (userKnowsFriend) {
    let updatedUserFriendlist = user[0].friends.filter(
      (entry) => entry !== friendId
    );
    await db
      .update(usersTable)
      .set({ friends: updatedUserFriendlist })
      .where(eq(usersTable.id, id));
  }

  if (friendKnowsUser) {
    let updatedFriendFriendlist = friend[0].friends.filter(
      (entry) => entry !== id
    );
    await db
      .update(usersTable)
      .set({ friends: updatedFriendFriendlist })
      .where(eq(usersTable.id, friendId));
  }

  return c.json(
    { message: 'These two doges are now strangers to each other !' },
    200
  );
});

//? Retrieve a list of all friends for a given user
users.get('/:id/friends', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { id } = c.req.param();

  const user = await db
    .select({ id: usersTable.id, friends: usersTable.friends })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (user.length === 0) {
    return c.json({ error: 'No doge found :(' }, 400);
  }

  const userFriendlist = user[0].friends;

  const { password, ...safeData } = getTableColumns(usersTable);

  const friendlist = await db
    .select({ ...safeData })
    .from(usersTable)
    .where(inArray(usersTable.id, userFriendlist));

  return c.json({ friendlist }, 200);
});

export default users;
