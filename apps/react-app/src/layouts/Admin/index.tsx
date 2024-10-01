import styles from './styles.module.scss';
import AdminProvider from '@/providers/AdminProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useFriends } from '@/providers/FriendsProvider';
import Button from '@/components/Button';
import Logout from '@/assets/vectors/logout.svg';
import Dashboard from '@/assets/vectors/dashboard.svg';
import Add from '@/assets/vectors/add.svg';
import Profile from '../Default/components/Profile';
import UsersList from './components/UsersList';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resetProvider } = useFriends();

  const handleLogout = async () => {
    await logout().then(() => {
      resetProvider();
      navigate('/auth');
    });
  };

  const handleDashboard = () => {
    navigate('/');
  };

  return (
    <AdminProvider>
      <aside className={styles.navigation}>
        <div className={styles.header}>
          <img src='/cool.png' alt='Doge !' />
          <p className={styles.title}>DOGEMASTER</p>
        </div>
        <UsersList />
        <Button
          onClick={() => navigate('/admin/create')}
          fullWidth
          custom={{ margin: '0 0 8px' }}
        >
          <p>Create user</p>
          <Add />
        </Button>
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
