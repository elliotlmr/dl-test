'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Add from '@/assets/vectors/add.svg';
import Arrow from '@/assets/vectors/arrow-down.svg';
import { useFriends } from '@/utils/FriendsProvider';
import { useRouter } from 'next/navigation';
import RequestTab from '../RequestTab';
import FriendTab from '../FriendTab';

const Friendlist = () => {
  const router = useRouter();
  const { friends, pendingRequests, getAllFriends, getPendingRequests } =
    useFriends();
  const [openRequests, setOpenRequest] = useState<boolean>(false);
  const [openFriendlist, setOpenFriendlist] = useState<boolean>(false);

  useEffect(() => {
    if (!friends) {
      getAllFriends();
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
        {openRequests && (
          <div className={styles.requestsList}>
            {pendingRequests?.map((request, i) => {
              return (
                <RequestTab
                  request={request}
                  refresh={() => {
                    getPendingRequests();
                    getAllFriends();
                  }}
                  key={i}
                  index={i}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.list}>
        <div
          className={`${styles.dropdown} ${openFriendlist && styles.open}`}
          onClick={() => setOpenFriendlist(!openFriendlist)}
        >
          <p>Friends ({friends ? friends.length : 0})</p>
          <Arrow />
        </div>
        {openFriendlist && (
          <div className={styles.friends}>
            {friends?.map((friend, i) => {
              return <FriendTab key={i} user={friend} index={i} />;
            })}
          </div>
        )}
      </div>

      <button
        className={styles.add}
        onClick={() => router.push('/dashboard/add')}
      >
        <p>Find a good doge</p>
        <Add />
      </button>
    </div>
  );
};

export default Friendlist;
