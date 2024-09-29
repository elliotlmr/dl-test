'use client';

import { User } from '@repo/types/users';
import Copy from '@/assets/vectors/copy.svg';
import styles from './styles.module.scss';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';

type Props = {
  user: User;
};

const Profile = ({ user }: Props) => {
  const router = useRouter();

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleClipboard = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(user.id);
  };

  return (
    <div className={styles.profile}>
      <p className={styles.username}>{user.username}</p>
      <div className={styles.id} onClick={(e) => handleClipboard(e)}>
        <p>ID: {user.id}</p>
        <Copy />
      </div>
    </div>
  );
};

export default Profile;
