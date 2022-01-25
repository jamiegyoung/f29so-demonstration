import { useEffect, useState } from 'react';
import styles from './Spinner.module.css';

function Spinner() {
  const [randomColor, setRandomColor] = useState(21);

  const calcRandomColor = (): number => {
    const newColor = Math.random() * 360;
    if (newColor < randomColor + 40 && newColor > randomColor - 40) {
      return calcRandomColor();
    }
    return newColor;
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRandomColor(calcRandomColor());
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [setRandomColor, calcRandomColor]);

  return (
    <div>
      <svg
        className={styles.Spinner}
        width="200"
        height="200"
        viewBox="0 0 317 317"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={styles.spinnerSection}
          d="M0 217H100V317H50C22.3858 317 0 294.614 0 267V217Z"
          fill={`HSL(${randomColor}, 100%, 50%)`}
        />
        <rect
          className={styles.spinnerSection}
          y="108.896"
          width="100"
          height="100"
          fill={`HSL(${randomColor}, 100%, 55%)`}
        />
        <path
          className={styles.spinnerSection}
          d="M0 50.792C0 23.1778 22.3858 0.791992 50 0.791992H100V100.792H0V50.792Z"
          fill={`HSL(${randomColor}, 100%, 60%)`}
        />
        <rect
          className={styles.spinnerSection}
          x="108.104"
          y="217"
          width="100"
          height="100"
          fill={`HSL(${randomColor}, 100%, 46%)`}
        />
        <rect
          className={styles.spinnerSection}
          x="108.104"
          y="108.896"
          width="100"
          height="100"
          fill={`HSL(${randomColor}, 100%, 50%)`}
        />
        <rect
          className={styles.spinnerSection}
          x="108.104"
          y="0.791992"
          width="100"
          height="100"
          fill={`HSL(${randomColor}, 100%, 55%)`}
        />
        <path
          className={styles.spinnerSection}
          d="M216.208 217H316.208V267C316.208 294.614 293.822 317 266.208 317H216.208V217Z"
          fill={`HSL(${randomColor}, 100%, 40%)`}
        />
        <rect
          className={styles.spinnerSection}
          x="216.208"
          y="108.896"
          width="100"
          height="100"
          fill={`HSL(${randomColor}, 100%, 46%)`}
        />
        <path
          className={styles.spinnerSection}
          d="M216.208 0.791992H266.208C293.822 0.791992 316.208 23.1778 316.208 50.792V100.792H216.208V0.791992Z"
          fill={`HSL(${randomColor}, 100%, 50%)`}
        />
      </svg>
    </div>
  );
}

export default Spinner;
