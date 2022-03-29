import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import Logo from './Logo';
import Search from './Search';
import ProfileImage from './ProfileImage';
import useDate from '../hooks/useDate';

type NavBarProps = {
  username: string | undefined;
  contributions: number | undefined;
  joined: number | undefined;
};

function NavBar({ username, joined, contributions }: NavBarProps) {
  return (
    <div className={styles.bar}>
      <Link to="/" className={`${styles.logoFormat} no-select`}>
        <Logo size={0.25} />
        <h1 className={styles.logoText}>WALLS</h1>
      </Link>
      <div className={styles.stripContainer}>
        <Search />
        <div className={styles.profileContainer}>
          <ProfileImage size={50} />
          <div className={`${styles.profileInfoContainer} no-select`}>
            <p style={{ color: '#EDEEF0', fontWeight: '500' }}>
              [ {username} ]
            </p>
            <p>joined {joined ? useDate(joined) : ''}</p>
            <p>contributions: {contributions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
