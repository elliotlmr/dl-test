export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  friends?: string[];
  blacklist?: string[];
  role: string;
};

export type FriendRequest = {
  id: string;
  created_at: string;
  user_id: string;
  username: string;
  friend_id: string;
  friendUsername?: string;
  status: 'pending' | 'accepted';
  treated_at?: string;
};
