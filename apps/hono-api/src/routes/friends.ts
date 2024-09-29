import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Hono } from 'hono';
import { Env, Variables } from '..';
import { friendRequests, users } from '../schemas/users';
import {
  aliasedTable,
  and,
  eq,
  getTableColumns,
  ilike,
  inArray,
  like,
  ne,
  notInArray,
  or,
} from 'drizzle-orm';

const friends = new Hono<{ Variables: Variables; Bindings: Env }>();

//? Get all friends
friends.get('/', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');

  const userFriendlist = await db
    .select({ friends: users.friends })
    .from(users)
    .where(eq(users.id, user.id));

  if (userFriendlist.length === 0) {
    return c.json({ error: 'Error getting user friendlist !' }, 400);
  }

  const { friends } = userFriendlist[0];

  const { password, ...safeData } = getTableColumns(users);

  const friendlist = await db
    .select({ ...safeData })
    .from(users)
    .where(inArray(users.id, friends));

  return c.json({ friendlist }, 200);
});

//? Get users list from search query (limit 10)
friends.get('/search', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');

  const userFriendlist = await db
    .select({ friends: users.friends })
    .from(users)
    .where(eq(users.id, user.id));

  if (userFriendlist.length === 0) {
    return c.json({ error: "Couldn't find user's friendlist !" }, 400);
  }

  const { friends: friendlist } = userFriendlist[0];

  if (userFriendlist.length === 0) {
    return c.json({ error: "Couldn't find user's friendlist !" }, 400);
  }

  //? Check pending requests to filter users already in queue
  const pendingRequests = await db
    .select({
      user_id: friendRequests.user_id,
      friend_id: friendRequests.friend_id,
    })
    .from(friendRequests)
    .where(
      or(
        and(
          eq(friendRequests.status, 'pending'),
          eq(friendRequests.user_id, user.id)
        ),
        and(
          eq(friendRequests.status, 'pending'),
          eq(friendRequests.friend_id, user.id)
        )
      )
    );

  //? Combine all IDs in one array
  const allIds = pendingRequests.flatMap(({ user_id, friend_id }) => [
    user_id,
    friend_id,
  ]);

  //? Delete duplicates
  const uniqueIds = Array.from(new Set(allIds));

  const query = c.req.query('q');

  if (!query) {
    return c.json({ error: 'Query parameter is required' }, 400);
  }

  try {
    const matchingUsers = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(
        and(
          notInArray(users.id, friendlist), // Not in the friendlist
          notInArray(users.id, uniqueIds), // Not in the pending requests
          ne(users.id, user.id), // Not the user itself
          ilike(users.username, `%${query}%`)
        )
      )
      .limit(10);

    return c.json(matchingUsers, 200);
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Error fetching users' }, 500);
  }
});

//? Get all pending requests for the connected user (sent and incoming)
friends.get('/requests', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');

  const friends = aliasedTable(users, 'friends');
  // Get the request
  const requests = await db
    .select({
      id: friendRequests.id,
      user_id: friendRequests.user_id,
      friend_id: friendRequests.friend_id,
      status: friendRequests.status,
      created_at: friendRequests.created_at,
      treated_at: friendRequests.treated_at,
      username: users.username,
      friendUsername: friends.username,
    })
    .from(friendRequests)
    .where(
      or(
        and(
          eq(friendRequests.status, 'pending'),
          eq(friendRequests.user_id, user.id)
        ),
        and(
          eq(friendRequests.status, 'pending'),
          eq(friendRequests.friend_id, user.id)
        )
      )
    )
    .leftJoin(friends, eq(friendRequests.friend_id, friends.id))
    .rightJoin(users, eq(friendRequests.user_id, users.id));

  console.log(requests);

  if (requests.length === 0) {
    return c.json({ error: 'No request found :(' });
  }

  return c.json({ requests }, 200);
});

//? Send a friend request
friends.post('/add/:friendId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');

  const { friendId } = c.req.param();

  if (user.id === friendId) {
    return c.json(
      { error: 'You cannot send a friend request to yourself' },
      400
    );
  }

  // Check if a friend request already exists
  const existingRequest = await db
    .select()
    .from(friendRequests)
    .where(
      and(
        eq(friendRequests.user_id, user.id),
        eq(friendRequests.friend_id, friendId)
      )
    );

  if (existingRequest.length > 0) {
    return c.json({ error: 'Friend request already sent' }, 400);
  }

  // Insert a new (pending) friend request
  await db
    .insert(friendRequests)
    .values({ user_id: user.id, friend_id: friendId });

  return c.json({ message: 'Friend request sent' }, 201);
});

//? Accept a friend request
friends.post('/accept/:requestId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const { requestId } = c.req.param();

  // Get the request
  const request = await db
    .select()
    .from(friendRequests)
    .where(eq(friendRequests.id, requestId));

  if (request.length === 0 || request[0].status !== 'pending') {
    return c.json({ error: 'Invalid or already processed request' }, 400);
  }

  const { user_id, friend_id } = request[0];

  console.log(user_id, friend_id, request[0]);

  // Update friendlists for both users

  // Update user's friendlist
  const user = await db
    .select({ userFriends: users.friends })
    .from(users)
    .where(eq(users.id, user_id));
  const { userFriends } = user[0];
  let updatedUserFriends = userFriends;
  userFriends.push(friend_id);

  await db
    .update(users)
    .set({ friends: updatedUserFriends })
    .where(eq(users.id, user_id));

  // Update new friend's friendlist
  const friend = await db
    .select({ friendFriends: users.friends })
    .from(users)
    .where(eq(users.id, friend_id));
  const { friendFriends } = friend[0];
  let updatedFriendFriends = friendFriends;
  friendFriends.push(user_id);
  await db
    .update(users)
    .set({ friends: updatedFriendFriends })
    .where(eq(users.id, friend_id));

  // Update request status
  await db
    .update(friendRequests)
    .set({ status: 'accepted', treated_at: new Date() })
    .where(eq(friendRequests.id, requestId));

  return c.json({ message: 'Doges are now friends :)' }, 200);
});

//? Accept a friend request
friends.delete('/refuse/:requestId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');

  const { requestId } = c.req.param();

  // Get the request
  const request = await db
    .select()
    .from(friendRequests)
    .where(eq(friendRequests.id, requestId));

  if (request.length === 0 || request[0].status !== 'pending') {
    return c.json({ error: 'Invalid or already processed request' }, 400);
  }

  const isAuthorized =
    request[0].friend_id === user.id || request[0].user_id === user.id;

  if (!isAuthorized) {
    return c.json(
      { error: 'You are not authorized to delete this friend request' },
      403
    );
  }

  // Delete the friend request
  await db.delete(friendRequests).where(eq(friendRequests.id, requestId));

  return c.json({ success: 'Friend request deleted' }, 200);
});

//? Get friend's infos
friends.get('/:friendId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');

  const { friendId } = c.req.param();

  const friends = await db
    .select({
      id: users.id,
      username: users.username,
      firstname: users.firstname,
      lastname: users.lastname,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, friendId));

  if (friends.length === 0) {
    return c.json({ error: 'Error getting user friendlist !' }, 400);
  }

  const friend = friends[0];

  return c.json({ friend }, 200);
});

friends.delete('/:friendId', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  const user = c.get('user');
  const { friendId } = c.req.param();

  const userFriendList = await db
    .select({ friends: users.friends })
    .from(users)
    .where(eq(users.id, user.id));

  if (userFriendList.length === 0) {
    return c.json({ error: "Couldn't find user !" }, 400);
  }

  const { friends: userFriends } = userFriendList[0];

  const userKnowsFriend = userFriends.find((entry) => entry === friendId);

  if (!userKnowsFriend) {
    return c.json(
      { error: "Couldn't find friend in user's friendlist !" },
      400
    );
  }

  const friend = await db
    .select({ friends: users.friends })
    .from(users)
    .where(eq(users.id, friendId));

  if (friend.length === 0) {
    return c.json({ error: "Couldn't find friend !" }, 400);
  }

  const { friends: friendFriends } = friend[0];

  const friendKnowsUser = friendFriends.find((entry) => entry === user.id);

  if (!friendKnowsUser) {
    return c.json(
      { error: "Couldn't find friend in user's friendlist !" },
      400
    );
  }

  //? Update user's friendlist
  let newUserFriendlist = userFriends.filter((entry) => entry !== friendId);

  try {
    await db
      .update(users)
      .set({ friends: newUserFriendlist })
      .where(eq(users.id, user.id));
  } catch (err) {
    console.log(err);
    return c.json({ error: "Error updating user's friendlist !" }, 400);
  }

  //? Update friend's friendlist
  let newFriendFriendlist = friendFriends.filter((entry) => entry !== user.id);

  try {
    await db
      .update(users)
      .set({ friends: newFriendFriendlist })
      .where(eq(users.id, friendId));
  } catch (err) {
    console.log(err);
    return c.json({ error: "Error updating friend's friendlist !" }, 400);
  }

  return c.json(
    { message: 'Friend has been removed (from both friendlists) !' },
    200
  );
});

export default friends;
