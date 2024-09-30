'use client';

import { useContext, createContext, useState } from 'react';
import { User } from '@/types/users';
import api from './api';
import { AxiosResponse } from 'axios';

type AdminContextType = {
  users: User[] | null;
  getAllUsers: () => Promise<void>;
  createUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<AxiosResponse<any>>;
  addFriendToUser: (
    userId: string,
    friendId: string
  ) => Promise<AxiosResponse<any>>;
  removeFriendFromUser: (
    userId: string,
    friendId: string
  ) => Promise<AxiosResponse<any>>;
  getFriendsOfUser: (userId: string) => Promise<User[]>;
  refreshAdminProvider: () => void;
};

const AdminContext = createContext<AdminContextType>({
  users: null,
  getAllUsers: async () => {},
  createUser: async () => {
    return Promise.resolve({ data: {} } as AxiosResponse);
  },
  addFriendToUser: async () => {
    return Promise.resolve({ data: {} } as AxiosResponse);
  },
  removeFriendFromUser: async () => {
    return Promise.resolve({ data: {} } as AxiosResponse);
  },
  getFriendsOfUser: async () => [],
  refreshAdminProvider: () => {},
});

type Props = {
  children: React.ReactNode;
};

const AdminProvider = ({ children }: Props) => {
  const [users, setUsers] = useState<User[] | null>(null);

  const getAllUsers = async () => {
    await api
      .get('/api/users', {})
      .then((res) => {
        console.log(res.data.users);
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (!username || !email || !password) {
      throw new Error('Missing username, email or password !');
    }
    return await api
      .post('/api/users', {
        username,
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        getAllUsers();
        return res;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  const addFriendToUser = async (userId: string, friendId: string) => {
    return await api
      .post(`/api/users/${userId}/friends/${friendId}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  const removeFriendFromUser = async (userId: string, friendId: string) => {
    return await api
      .delete(`/api/users/${userId}/friends/${friendId}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  const getFriendsOfUser = async (userId: string): Promise<User[]> => {
    return await api
      .get(`/api/users/${userId}/friends`)
      .then((res) => {
        console.log(res);
        return res.data.friendlist;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

  const refreshAdminProvider = () => {
    setUsers(null);
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        getAllUsers,
        createUser,
        addFriendToUser,
        removeFriendFromUser,
        getFriendsOfUser,
        refreshAdminProvider,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;

export const useAdmin = () => {
  return useContext(AdminContext);
};
