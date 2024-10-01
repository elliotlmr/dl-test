import { ChangeEventHandler, useState } from 'react';
import Visibility from '@/assets/vectors/visibility.svg';
import VisibilityOff from '@/assets/vectors/visibility-off.svg';
import styles from './styles.module.scss';

type Props = {
  title: string;
  type: string;
  errorMessage: null | string;
  content: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  color?: string;
  fullwidth?: boolean;
};

const TextInput = ({
  title,
  type,
  errorMessage,
  content,
  handleChange,
  disabled = false,
  color,
  fullwidth,
}: Props) => {
  const [show, setShow] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  function getType() {
    if (type === 'password') {
      return show ? 'text' : 'password';
    }
    return type;
  }

  function handleFocus(value: boolean) {
    setIsFocus(value);
  }

  return (
    <div className={`${styles.wrapper} ${fullwidth && styles.full}`}>
      <label
        className={`${styles.container} ${
          errorMessage && styles.errorContainer
        } ${color ? styles[color] : ''}`}
      >
        <span
          className={`${styles.title} ${isFocus && styles.focused} ${
            content.length > 0 && styles.filled
          }`}
          title={title}
        >
          {title}
        </span>
        <input
          type={getType()}
          value={content}
          onChange={(e) => handleChange(e)}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
          className={`${styles.input} ${content.length > 0 && styles.filled}`}
          disabled={disabled}
        ></input>
        {type === 'password' && (
          <button
            className={styles.visibility}
            type='button'
            onClick={() => setShow(!show)}
          >
            {show ? <VisibilityOff /> : <Visibility />}
          </button>
        )}
      </label>
      {/* Display an error message if provided as props */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default TextInput;
