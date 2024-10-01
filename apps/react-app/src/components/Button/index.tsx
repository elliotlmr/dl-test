import React, { ChangeEventHandler, useState } from 'react';
import Visibility from '@/assets/vectors/visibility.svg';
import VisibilityOff from '@/assets/vectors/visibility-off.svg';
import styles from './styles.module.scss';

type Props = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick: () => void;
  disabled?: boolean;
  svgSize?: 'small' | 'normal' | 'big';
  fullWidth: boolean;
  color?: string;
  custom?: React.CSSProperties | undefined;
};

const Button = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  svgSize = 'normal',
  fullWidth = false,
  color = 'gold',
  custom,
}: Props) => {
  const [show, setShow] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[color]} ${styles[svgSize]} ${fullWidth && styles.full}`}
      disabled={disabled}
      style={custom}
    >
      {children}
    </button>
  );
};

export default Button;
