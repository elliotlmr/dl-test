'use client';

import { useContext, createContext, useState } from 'react';
import { FriendRequest, User } from '@repo/types/users';
import { useRouter } from 'next/navigation';
import api from './api';

type FriendsContextType = {
  friends: string[] | null;
  blacklist: string[] | null;
  pendingRequests: FriendRequest[] | null;
  getAllFriendsID: () => Promise<void>;
  addOneFriend: (friendId: string) => Promise<void>;
  removeOneFriend: (friendId: string) => Promise<void>;
  getPendingRequests: () => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
};

const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  blacklist: [],
  pendingRequests: [],
  getAllFriendsID: async () => {},
  addOneFriend: async () => Promise.resolve(),
  removeOneFriend: async () => Promise.resolve(),
  getPendingRequests: async () => {},
  acceptFriendRequest: async () => Promise.resolve(),
});

type Props = {
  children: React.ReactNode;
};

const FriendsProvider = ({ children }: Props) => {
  const [friends, setFriends] = useState<string[] | null>(null);
  const [blacklist, setBlacklist] = useState<string[] | null>(null);
  const [pendingRequests, setPendingRequests] = useState<
    FriendRequest[] | null
  >(null);

  const getAllFriendsID = async () => {
    api
      .get('/api/friends')
      .then((res) => {
        console.log('Friends fetched !');
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.error("Couldn't get friends", err);
      });
  };

  const addOneFriend = async (friendId: string) => {
    api
      .post(`/api/friends/add/${friendId}`)
      .then((res) => {
        console.log('Friend request sent !', res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeOneFriend = async (friendId: string) => {
    api
      .delete(`/api/friends/${friendId}`)
      .then((res) => {
        console.log('Friend deleted !');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPendingRequests = async () => {
    api
      .get(`/api/friends/requests`)
      .then((res) => {
        console.log('Friends requests fetched !');
        setPendingRequests(res.data.requests);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const acceptFriendRequest = async (requestId: string) => {
    api
      .post(`/api/friends/accept/${requestId}`)
      .then((res) => {
        console.log('Friend request accepted !');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        blacklist,
        pendingRequests,
        getAllFriendsID,
        addOneFriend,
        removeOneFriend,
        getPendingRequests,
        acceptFriendRequest,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsProvider;

export const useFriends = () => {
  return useContext(FriendsContext);
};
