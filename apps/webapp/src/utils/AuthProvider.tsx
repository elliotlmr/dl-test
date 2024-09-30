'use client';

import { useContext, createContext, useState, useEffect } from 'react';
import { User } from '@/types/users';
import api from './api';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async () => Promise.resolve(),
  login: async () => Promise.resolve(),
  logout: async () => {},
});

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (!username || !email || !password) {
      throw new Error('Missing username, email or password !');
    }
    await api
      .post('/auth/register', {
        username,
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = async (email = user?.email, password = user?.password) => {
    if (!email || !password) {
      throw new Error('Missing email or password !');
    }
    await api
      .post('/auth/login', {
        email,
        password,
      })
      .then((res) => {
        console.log('NORMAL LOGIN', res);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginWithCookie = async () => {
    await api
      .post('/auth/loginWithCookie')
      .then((res) => {
        console.log('Login with cookie success', res);
        setUser(res.data.user);
        if (window.location.pathname === '/login') {
          router.push('/dashboard');
        }
      })
      .catch((err) => {
        console.log('Login with cookie failed', err);
      });
  };

  const logout = async () => {
    await api
      .post('/auth/logout')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!user) {
      loginWithCookie();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
