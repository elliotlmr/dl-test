import { useFriends } from '@/providers/FriendsProvider';
import styles from './styles.module.scss';
import PersonAdd from '@/assets/vectors/person-add.svg';

type Props = {
  user: {
    id: string;
    username: string;
  };
  index: number;
  refresh: () => void;
};

const FriendButton = ({ user, index, refresh }: Props) => {
  const { addOneFriend } = useFriends();

  const handleClick = () => {
    addOneFriend(user.id)
      .then(() => {
        refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button
      className={styles.button}
      style={{ animationDelay: `${index * 50}ms` }}
      title='Send a friend request'
      onClick={handleClick}
    >
      <div className={styles.default}>
        <img src='/calm.png' alt='Doge is calm !' className={styles.img} />
        <p className={styles.username}>{user.username}</p>
      </div>
      <div className={styles.hover}>
        <PersonAdd />
      </div>
    </button>
  );
};

export default FriendButton;
