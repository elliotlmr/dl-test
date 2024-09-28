'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import api from '@/utils/api';
import Refresh from '@/assets/vectors/refresh.svg';
import Button from '@/components/Button';

const Kpis = () => {
  const [population, setPopulation] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  const getPopulation = () => {
    api
      .get('/api/kpis/number-of-users')
      .then((res) => {
        console.log(res);
        setPopulation(res.data.population);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAverage = () => {
    api
      .get('/api/kpis/average-friends-per-user')
      .then((res) => {
        console.log(res);
        setAverage(res.data.average);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!population) {
      getPopulation();
    }
    if (!average) {
      getAverage();
    }
  }, []);

  const refresh = () => {
    getPopulation();
    getAverage();
  };

  return (
    <div className={styles.container}>
      {population !== null && (
        <div className={styles.kpi}>
          <p className={styles.data}>{population}</p>
          <p className={styles.legend}>users on the server</p>
          <div className={styles.separator} />
        </div>
      )}
      {average !== null && (
        <div className={styles.kpi}>
          <p className={styles.data}>{average}</p>
          <p className={styles.legend}>friends per user on average</p>
          <div className={styles.separator} />
        </div>
      )}
      <Button onClick={refresh} fullWidth custom={{ margin: 'auto 0 0' }}>
        <p>Refresh</p>
        <Refresh />
      </Button>
    </div>
  );
};

export default Kpis;
