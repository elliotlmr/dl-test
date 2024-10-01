import { useContext, createContext, useState, SetStateAction } from 'react';
import { User } from '@repo/types/users';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithCookie: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async () => Promise.resolve(),
  login: async () => Promise.resolve(),
  logout: async () => {},
  loginWithCookie: async () => Promise.resolve(),
});

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
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
      .then((res: { data: { user: SetStateAction<User | null> } }) => {
        console.log(res);
        setUser(res.data.user);
      })
      .catch((err: unknown) => {
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
      .then((res: { data: { user: SetStateAction<User | null> } }) => {
        console.log('NORMAL LOGIN', res);
        setUser(res.data.user);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  };

  const loginWithCookie = async () => {
    await api
      .post('/auth/loginWithCookie')
      .then((res: { data: { user: SetStateAction<User | null> } }) => {
        console.log('Login with cookie success', res);
        setUser(res.data.user);
        if (window.location.pathname === '/auth') {
          navigate('/');
        }
      })
      .catch((err: unknown) => {
        console.log('Login with cookie failed', err);
        throw err;
      });
  };

  const logout = async () => {
    await api
      .post('/auth/logout')
      .then((res: unknown) => {
        console.log(res);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, loginWithCookie }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
