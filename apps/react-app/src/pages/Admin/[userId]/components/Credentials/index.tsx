import { User } from '@repo/types/users';
import styles from './styles.module.scss';

type Props = {
  user: User;
};

const Credentials = ({ user }: Props) => {
  const handleCopy = (value: string) => {
    console.log(`${value} copied in the clipboard !`);
    navigator.clipboard.writeText(value);
  };

  return (
    <table className={styles.credentials}>
      <tbody className={styles.body}>
        {Object.entries(user).map(([key, value], i) => {
          const getValue = () => {
            if (value === null) {
              return 'NULL';
            }
            if (typeof value === 'string') {
              return value.length > 0 ? value : 'NULL';
            }
            if (Array.isArray(value)) {
              return value.length > 0 ? `[ "${value.join('", "')}" ]` : '[ ]';
            }
            return 'undefined';
          };

          return (
            <tr
              key={i}
              className={styles.row}
              onClick={() => handleCopy(getValue()?.toString())}
            >
              <td className={styles.key}>{key}</td>
              <td className={styles.value}>{getValue()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Credentials;
