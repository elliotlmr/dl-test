import { useFriends } from '@/providers/FriendsProvider';
import styles from './page.module.scss';
import Arrow from '@/assets/vectors/arrow-down.svg';
import Delete from '@/assets/vectors/delete.svg';
import FriendTab from '@/layouts/Default/components/FriendTab';
import { useState } from 'react';
import Button from '@/components/Button';
import { useNavigate, useParams } from 'react-router-dom';

const FriendProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [openFriendlist, setOpenFriendlist] = useState<boolean>(false);
  const { friends, removeOneFriend, getAllFriends } = useFriends();

  const selectedFriend = friends?.find((entry) => entry.id === userId);

  const commonFriends = friends?.filter((entry) =>
    selectedFriend?.friends?.includes(entry.id)
  );

  const handleRemoveFriend = async () => {
    if (userId) {
      removeOneFriend(userId).then(() => {
        getAllFriends();
        navigate('/');
      });
    }
  };

  return selectedFriend ? (
    <div className={styles.page}>
      <img className={styles.img} src='/profile.jpg' alt='Calm doge !' />
      <p className={styles.username}>{selectedFriend.username}</p>
      <div className={styles.separator} />
      <div className={styles.info}>
        <p>ID : </p>
        <span>{selectedFriend.id}</span>
      </div>
      <div className={styles.info}>
        <p>Email : </p>
        <span>{selectedFriend.email}</span>
      </div>
      <div className={styles.separator} />
      <div className={styles.common}>
        <div
          className={`${styles.dropdown} ${openFriendlist && styles.open}`}
          onClick={() => setOpenFriendlist(!openFriendlist)}
        >
          <p>Mutual friends ({commonFriends ? commonFriends.length : 0})</p>
          <Arrow />
        </div>
        {openFriendlist && (
          <div className={styles.friends}>
            {commonFriends?.map((friend, i) => {
              return <FriendTab user={friend} index={i} key={i} />;
            })}
          </div>
        )}
      </div>
      <Button color='outlined-grey' onClick={handleRemoveFriend} fullWidth>
        <p>Remove friend</p>
        <Delete />
      </Button>
    </div>
  ) : (
    <div className={styles.page}>
      <div className={styles.loader} />
    </div>
  );
};

export default FriendProfile;
