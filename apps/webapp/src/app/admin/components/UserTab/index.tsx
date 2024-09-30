'use client';

import { User } from '@/types/users';
import styles from './styles.module.scss';
import Person from '@/assets/vectors/person.svg';
import { useRouter } from 'next/navigation';

type Props = {
  user: User;
  index: number;
};

const UserTab = ({ user, index }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/${user.id}`);
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
