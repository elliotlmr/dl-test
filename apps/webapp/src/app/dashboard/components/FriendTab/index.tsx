'use client';

import api from '@/utils/api';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { User } from '@repo/types/users';

type Props = {
  userId: string;
};

const FriendTab = ({ userId }: Props) => {
  const [friend, setFriend] = useState<User | null>(null);

  const getData = async (userId: string) => {
    api
      .get(`/api/friends/${userId}`)
      .then((res) => {
        setFriend(res.data);
      })
      .catch((err) => {
        console.error("Couldn't get friend", err);
      });
  };

  useEffect(() => {
    if (!friend) {
      getData(userId);
    }
  }, []);

  return (
    <div>
      <img src='/calm.png' alt='Doge is calm !' />
      <p></p>
    </div>
  );
};

export default FriendTab;
