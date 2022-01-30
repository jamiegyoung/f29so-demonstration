import { ButtonHTMLAttributes } from 'react';
import styles from './StyledButton.module.css';

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function StyledButton(props: StyledButtonProps) {
  const { children, className } = props;
  return (
    <button
      type="button"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={`${className || ''} ${styles.button}`}
    >
      {children}
    </button>
  );
}

export default StyledButton;
