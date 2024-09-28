'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Add from '@/assets/vectors/add.svg';
import Arrow from '@/assets/vectors/arrow-down.svg';
import { useFriends } from '@/utils/FriendsProvider';
import { useRouter } from 'next/navigation';
import RequestTab from '../RequestTab';

const Friendlist = () => {
  const router = useRouter();
  const { friends, pendingRequests, getAllFriendsID, getPendingRequests } =
    useFriends();
  const [openRequests, setOpenRequest] = useState<boolean>(false);
  const [openFriendlist, setOpenFriendlist] = useState<boolean>(false);

  useEffect(() => {
    if (!friends) {
      getAllFriendsID();
    }
    if (!pendingRequests) {
      getPendingRequests();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div
          className={`${styles.dropdown} ${openRequests && styles.open}`}
          onClick={() => setOpenRequest(!openRequests)}
        >
          <p>
            Friend requests ({pendingRequests ? pendingRequests.length : 0})
          </p>
          <Arrow />
        </div>
        <div className={styles.requestsList}>
          {pendingRequests?.map((request, i) => {
            return <RequestTab request={request} key={i} />;
          })}
        </div>
      </div>
      {friends && friends.length > 0 ? (
        <div className={styles.list}>
          <div
            className={`${styles.dropdown} ${openFriendlist && styles.open}`}
            onClick={() => setOpenFriendlist(!openFriendlist)}
          >
            <p>Friend requests ({friends.length})</p>
            <Arrow />
          </div>
        </div>
      ) : (
        <button
          className={styles.add}
          onClick={() => router.push('/dashboard/add')}
        >
          <p>Find a good doge</p>
          <Add />
        </button>
      )}
    </div>
  );
};

export default Friendlist;
