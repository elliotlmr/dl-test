import { useNavigate } from 'react-router-dom';
import styles from './page.module.scss';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/add');
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
