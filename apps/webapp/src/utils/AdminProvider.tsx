'use client';

import { useContext, createContext, useState } from 'react';
import { User } from '@repo/types/users';
import api from './api';

type AdminContextType = {
  users: User[] | null;
  getAllUsers: () => Promise<void>;
  createUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  addFriendToUser: (userId: string, friendId: string) => Promise<void>;
  removeFriendFromUser: (userId: string, friendId: string) => Promise<void>;
  getFriendsOfUser: (userId: string) => Promise<void>;
  refreshAdminProvider: () => void;
};

const AdminContext = createContext<AdminContextType>({
  users: null,
  getAllUsers: async () => {},
  createUser: async () => Promise.resolve(),
  addFriendToUser: async () => Promise.resolve(),
  removeFriendFromUser: async () => Promise.resolve(),
  getFriendsOfUser: async () => Promise.resolve(),
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
    await api
      .post('/api/users', {
        username,
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        getAllUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addFriendToUser = async (userId: string, friendId: string) => {
    await api
      .post(`/api/users/${userId}/friends/${friendId}`)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeFriendFromUser = async (userId: string, friendId: string) => {
    await api
      .delete(`/api/users/${userId}/friends/${friendId}`)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFriendsOfUser = async (userId: string) => {
    await api
      .get(`/api/users/${userId}/friends`)
      .then((res) => {
        console.log(res);
        return res.data.friends;
      })
      .catch((err) => {
        console.log(err);
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
