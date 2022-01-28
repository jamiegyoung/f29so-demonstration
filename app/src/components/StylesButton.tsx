import { ButtonHTMLAttributes } from 'react';
import styles from './StyledButton.module.css';

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function StyledButton(props: StyledButtonProps) {
  const { children } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <button type="button" {...props} className={styles.button}>
      {children}
    </button>
  );
}

export default StyledButton;
