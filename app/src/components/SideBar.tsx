import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import styles from './SideBar.module.css';

const sideBarSelection = [
  'home',
  'profile',
  'trending',
  'following',
  'settings',
];
const adminSideBarSelection = ['reports'];

function SideBar() {
  const { pathname } = useLocation();
  const user = useAppSelector((state) => state.user.user);
  return (
    <div className={`${styles.container} no-select`}>
      {sideBarSelection.map((key) => (
        <Link
          to={`/${key}`}
          key={key}
          className={`${
            key === pathname.slice(1).split('/')[0] ||
            (key === 'home' && pathname === '/')
              ? styles.selected
              : ''
          } ${styles.selection}`}
        >
          {key}
        </Link>
      ))}
      {user?.admin
        ? adminSideBarSelection.map((key) => (
            <Link
              to={`/${key}`}
              key={key}
              className={`${
                key === pathname.slice(1).split('/')[0] ? styles.selected : ''
              } ${styles.selection}`}
            >
              {key}
            </Link>
          ))
        : null}
    </div>
  );
}

export default SideBar;
