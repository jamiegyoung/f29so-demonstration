import { Link, useLocation } from 'react-router-dom';
import styles from './SideBar.module.css';

const sideBarSelection = ['home', 'profile', 'trending', 'following'];

function SideBar() {
  const { pathname } = useLocation();

  return (
    <div className={`${styles.container} no-select`}>
      {sideBarSelection.map((key) => (
        <Link
          to={`/${key}`}
          key={key}
          className={`${
            key === pathname.slice(1) || (key === 'home' && pathname === '/')
              ? styles.selected
              : ''
          } ${styles.selection}`}
        >
          {key}
        </Link>
      ))}
    </div>
  );
}

export default SideBar;
