'use client';

import AdminProvider from '@/utils/AdminProvider';
import styles from './layout.module.scss';
import Button from '@/components/Button';
import { useAuth } from '@/utils/AuthProvider';
import { useRouter } from 'next/navigation';
import { useFriends } from '@/utils/FriendsProvider';
import Logout from '@/assets/vectors/logout.svg';
import Dashboard from '@/assets/vectors/dashboard.svg';
import Profile from '../dashboard/components/Profile';
import UsersList from './components/UsersList';

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { resetProvider } = useFriends();

  const handleLogout = async () => {
    await logout().then(() => {
      resetProvider();
      router.push('/login');
    });
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <AdminProvider>
      <aside className={styles.navigation}>
        <div className={styles.header}>
          <img src='/cool.png' alt='Doge !' />
          <p className={styles.title}>DOGEMASTER</p>
        </div>
        <UsersList />
        {user && <Profile user={user} />}
        {user?.role === 'admin' && (
          <Button
            color='outlined-grey'
            onClick={handleDashboard}
            fullWidth
            custom={{ margin: '0 0 8px' }}
          >
            <p>Dashboard</p>
            <Dashboard />
          </Button>
        )}
        <Button color='outlined-grey' onClick={handleLogout} fullWidth>
          <p>Logout</p>
          <Logout />
        </Button>
      </aside>
      <main className={styles.wrapper}>
        <div className={styles.container}>{children}</div>
      </main>
    </AdminProvider>
  );
};

export default AdminLayout;
