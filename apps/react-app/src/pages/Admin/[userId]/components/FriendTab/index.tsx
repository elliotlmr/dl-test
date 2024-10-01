import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { User } from '@repo/types/users';

type Props = {
  user: User;
  index: number;
};

const FriendTab = ({ user, index }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/${user.id}`);
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
