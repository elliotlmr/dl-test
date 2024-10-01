import { useContext, createContext, useState } from 'react';
import { FriendRequest, User } from '@repo/types/users';
import api from '@/utils/api';

type FriendsContextType = {
  friends: User[] | null;
  blacklist: string[] | null;
  pendingRequests: FriendRequest[] | null;
  getAllFriends: () => Promise<void>;
  addOneFriend: (friendId: string) => Promise<void>;
  removeOneFriend: (friendId: string) => Promise<void>;
  getPendingRequests: () => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  refuseFriendRequest: (requestId: string) => Promise<void>;
  resetProvider: () => void;
};

const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  blacklist: [],
  pendingRequests: [],
  getAllFriends: async () => {},
  addOneFriend: async () => Promise.resolve(),
  removeOneFriend: async () => Promise.resolve(),
  getPendingRequests: async () => {},
  acceptFriendRequest: async () => Promise.resolve(),
  refuseFriendRequest: async () => Promise.resolve(),
  resetProvider: async () => {},
});

type Props = {
  children: React.ReactNode;
};

const FriendsProvider = ({ children }: Props) => {
  const [friends, setFriends] = useState<User[] | null>(null);
  const [blacklist, setBlacklist] = useState<string[] | null>(null);
  const [pendingRequests, setPendingRequests] = useState<
    FriendRequest[] | null
  >(null);

  const getAllFriends = async () => {
    await api
      .get('/api/friends')
      .then((res) => {
        console.log('Friends fetched !', res.data.friendlist);
        setFriends(res.data.friendlist);
      })
      .catch((err) => {
        console.error("Couldn't get friends", err);
      });
  };

  const addOneFriend = async (friendId: string) => {
    await api
      .post(`/api/friends/add/${friendId}`)
      .then((res) => {
        console.log('Friend request sent !', res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeOneFriend = async (friendId: string) => {
    await api
      .delete(`/api/friends/${friendId}`)
      .then((res) => {
        console.log('Friend deleted !', res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPendingRequests = async () => {
    await api
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
    await api
      .post(`/api/friends/accept/${requestId}`)
      .then((res) => {
        console.log('Friend request accepted !', res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refuseFriendRequest = async (requestId: string) => {
    await api
      .post(`/api/friends/refuse/${requestId}`)
      .then((res) => {
        console.log('Friend request refused !', res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetProvider = () => {
    setFriends(null);
    setPendingRequests(null);
    setBlacklist(null);
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        blacklist,
        pendingRequests,
        getAllFriends,
        addOneFriend,
        removeOneFriend,
        getPendingRequests,
        acceptFriendRequest,
        refuseFriendRequest,
        resetProvider,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useFriends = () => {
  return useContext(FriendsContext);
};
