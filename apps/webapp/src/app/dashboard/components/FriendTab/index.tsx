'use client';

import api from '@/utils/api';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { User } from '@repo/types/users';
import { useRouter } from 'next/navigation';

type Props = {
  user: User;
  index: number;
};

const FriendTab = ({ user, index }: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/dashboard/${user.id}`);
  };
  return (
    <div
      className={styles.container}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleClick}
    >
      <img className={styles.img} src='/calm.png' alt='Doge is calm !' />
      <p className={styles.name}>{user.username}</p>
    </div>
  );
};

export default FriendTab;
