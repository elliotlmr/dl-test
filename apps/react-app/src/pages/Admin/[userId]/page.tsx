import { useAdmin } from '@/providers/AdminProvider';
import styles from './page.module.scss';
import Credentials from './components/Credentials';
import Friendlist from './components/Friendlist';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams();
  const { users } = useAdmin();

  const selectedUser = users?.find((user) => user.id === userId);

  return (
    <div className={styles.page}>
      {userId && selectedUser ? (
        <>
          <div className={styles.header}>
            <img className={styles.img} src='/profile.jpg' alt='Profile !' />
            <Credentials user={selectedUser} />
          </div>
          <Friendlist userId={userId} />
        </>
      ) : (
        <div className={styles.loader} />
      )}
    </div>
  );
};

export default UserProfile;
