'use client';

import { useAuth } from '@/utils/AuthProvider';
import styles from './layout.module.scss';
import Profile from './components/Profile';
import Friendlist from './components/Friendlist';
import Info from '@/assets/vectors/info.svg';
import Kpis from './components/Kpis';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const { user } = useAuth();
  return (
    <div>
      <aside className={styles.navigation}>
        <div className={styles.header}>
          <img src='/doge.png' alt='Doge !' />
          <p className={styles.title}>DOGESCORD</p>
        </div>
        <Friendlist />
        {user && <Profile user={user} />}
      </aside>
      <main className={styles.wrapper}>
        <div className={styles.container}>{children}</div>
      </main>
      <aside className={styles.kpis}>
        <div className={styles.header}>
          <Info />
          <p className={styles.title}>nformations</p>
        </div>
        <Kpis />
      </aside>
    </div>
  );
};

export default DashboardLayout;
