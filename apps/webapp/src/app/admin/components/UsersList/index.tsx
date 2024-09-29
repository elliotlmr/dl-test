import { useAdmin } from '@/utils/AdminProvider';
import styles from './styles.module.scss';
import { useEffect } from 'react';
import UserTab from '../UserTab';

const UsersList = () => {
  const { users, getAllUsers, refreshAdminProvider } = useAdmin();

  useEffect(() => {
    if (!users) {
      getAllUsers();
    }
  }, []);

  return (
    <div className={styles.userslist}>
      <p className={styles.title}>Users list :</p>
      <div className={styles.list}>
        {users?.map((user, i) => {
          console.log(user);
          return <UserTab user={user} key={i} index={i} />;
        })}
      </div>
    </div>
  );
};

export default UsersList;
