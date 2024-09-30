'use client';

import { User } from '@/types/users';
import styles from './styles.module.scss';
import { useAdmin } from '@/utils/AdminProvider';
import { useEffect, useState } from 'react';
import Arrow from '@/assets/vectors/arrow-down.svg';
import Add from '@/assets/vectors/person-add.svg';
import Delete from '@/assets/vectors/delete.svg';
import FriendTab from '../FriendTab';
import TextInput from '@/components/TextInput';

type Props = {
  userId: string;
};

const Friendlist = ({ userId }: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  const [id, setId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [friends, setFriends] = useState<User[]>([]);
  const { getFriendsOfUser, addFriendToUser, removeFriendFromUser } =
    useAdmin();

  const refresh = async () => {
    await getFriendsOfUser(userId)
      .then((res) => {
        console.log(res);
        setFriends(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async () => {
    setError('');
    await addFriendToUser(userId, id)
      .then((res) => {
        console.log(res);
        refresh();
      })
      .catch((err) => {
        console.log('error', err.response.data.error);
        setError(err.response.data.error);
      });
  };

  const handleRemove = async () => {
    setError('');
    await removeFriendFromUser(userId, id)
      .then((res) => {
        console.log(res);
        refresh();
      })
      .catch((err) => {
        console.log('error', err.response.data.error);
        setError(err.response.data.error);
      });
  };

  return (
    <div className={styles.list}>
      <div className={styles.handler}>
        <TextInput
          title='User ID'
          type='text'
          errorMessage={error}
          content={id}
          handleChange={(e) => {
            setId(e.target.value);
            setError('');
          }}
          fullwidth
        />
        <button className={`${styles.btn} ${styles.add}`} onClick={handleAdd}>
          <Add />
        </button>
        <button
          className={`${styles.btn} ${styles.remove}`}
          onClick={handleRemove}
        >
          <Delete />
        </button>
      </div>
      <div
        className={`${styles.dropdown} ${open && styles.open}`}
        onClick={() => setOpen(!open)}
      >
        <p>Friends ({friends ? friends.length : 0})</p>
        <Arrow />
      </div>
      {open && (
        <div className={styles.friends}>
          {friends.length > 0 ? (
            friends?.map((friend, i) => {
              return <FriendTab key={i} user={friend} index={i} />;
            })
          ) : (
            <p className={styles.empty}>No doge in user's friendlist :(</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Friendlist;
