'use client';

import api from '@/utils/api';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { FriendRequest, User } from '@repo/types/users';

type Props = {
  request: FriendRequest;
};

const RequestTab = ({ request }: Props) => {
  const [friend, setFriend] = useState<User | null>(null);

  // const getData = async (userId: string) => {
  //   api
  //     .get(`/api/friends/${userId}`)
  //     .then((res) => {
  //       setFriend(res.data.friend);
  //     })
  //     .catch((err) => {
  //       console.error("Couldn't get friend", err);
  //     });
  // };

  // useEffect(() => {
  //   if (!friend) {
  //     getData(userId);
  //   }
  // }, []);

  return (
    <div>
      <p>{request.friendUsername}</p>
    </div>
  );
};

export default RequestTab;
