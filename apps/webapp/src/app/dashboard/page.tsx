'use client';

import { useAuth } from '@/utils/AuthProvider';
import styles from './page.module.scss';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/dashboard/add');
  };

  return (
    <p className={styles.howto}>
      Select a friend on the left menu,
      <br /> or if you dont have one yet,{' '}
      <span onClick={handleClick}>find a good doge !</span>
    </p>
  );
};

export default Dashboard;
