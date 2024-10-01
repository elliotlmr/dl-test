import { User } from '@repo/types/users';
import styles from './styles.module.scss';
import Person from '@/assets/vectors/person.svg';
import { useNavigate } from 'react-router-dom';

type Props = {
  user: User;
  index: number;
};

const UserTab = ({ user, index }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/${user.id}`);
  };

  return (
    <div
      className={styles.tab}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleClick}
    >
      <Person />
      <p>{user.username}</p>
    </div>
  );
};

export default UserTab;
