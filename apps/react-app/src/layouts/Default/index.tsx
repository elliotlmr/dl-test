import styles from './styles.module.scss';
import { useAuth } from '@/providers/AuthProvider';
import { useFriends } from '@/providers/FriendsProvider';
import Profile from './components/Profile';
import Friendlist from './components/Friendlist';
import Info from '@/assets/vectors/info.svg';
import Kpis from './components/Kpis';
import Button from '@/components/Button';
import Logout from '@/assets/vectors/logout.svg';
import Admin from '@/assets/vectors/admin.svg';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resetProvider } = useFriends();

  const handleLogout = async () => {
    await logout().then(() => {
      resetProvider();
      navigate('/auth');
    });
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  return (
    <div>
      <aside className={styles.navigation}>
        <div className={styles.header}>
          <img src='/doge.png' alt='Doge !' />
          <p className={styles.title}>DOGESCORD</p>
        </div>
        <Friendlist />
        {user && <Profile user={user} />}
        {user?.role === 'admin' && (
          <Button
            color='outlined-grey'
            onClick={handleAdmin}
            fullWidth
            custom={{ margin: '0 0 8px' }}
          >
            <p>Backoffice</p>
            <Admin />
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
      <aside className={styles.kpis}>
        <div className={styles.header}>
          <Info />
          <p className={styles.title}>nformations</p>
        </div>
        <Kpis />
      </aside>
    </div>
  );
};

export default DefaultLayout;
