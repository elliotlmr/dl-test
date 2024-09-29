'use client';

import { useAdmin } from '@/utils/AdminProvider';
import styles from './page.module.scss';

type Props = { params: { userId: string } };

const UserProfile = ({ params }: Props) => {
  const { users } = useAdmin();

  const selectedUser = users?.find((user) => user.id === params.userId);

  return (
    <div className={styles.page}>
      {selectedUser ? (
        <div className={styles.profile}>{selectedUser.username}</div>
      ) : (
        <div className={styles.loader} />
      )}
    </div>
  );
};

export default UserProfile;
