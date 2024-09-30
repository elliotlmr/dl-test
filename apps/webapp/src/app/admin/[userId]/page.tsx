'use client';

import { useAdmin } from '@/utils/AdminProvider';
import styles from './page.module.scss';
import Credentials from './components/Credentials';
import Friendlist from './components/Friendlist';

type Props = { params: { userId: string } };

const UserProfile = ({ params }: Props) => {
  const { users } = useAdmin();

  const selectedUser = users?.find((user) => user.id === params.userId);

  return (
    <div className={styles.page}>
      {selectedUser ? (
        <>
          <div className={styles.header}>
            <img className={styles.img} src='/profile.jpg' alt='Profile !' />
            <Credentials user={selectedUser} />
          </div>
          <Friendlist userId={params.userId} />
        </>
      ) : (
        <div className={styles.loader} />
      )}
    </div>
  );
};

export default UserProfile;
