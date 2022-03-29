import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './NavBar.module.css';
import Logo from './Logo';
import Search from './Search';
import ProfileImage from './ProfileImage';
import useDate from '../hooks/useDate';
import useWindowDimensions from '../hooks/useWindowDimensions';
import BurgerMenu from './BurgerMenu';

type NavBarProps = {
  username: string | undefined;
  contributions: number | undefined;
  joined: number | undefined;
};

function NavBar({ username, joined, contributions }: NavBarProps) {
  const { width } = useWindowDimensions();

  useEffect(() => {
    console.log(width);
    
  })

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
            <Link
              to="/profile"
              style={{
                color: '#EDEEF0',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              [ {username} ]
            </Link>
            <p>joined {joined ? useDate(joined) : ''}</p>
            <p>contributions: {contributions}</p>
          </div>
        </div>
        {width < 1000 ? <BurgerMenu /> : null}
      </div>
    </div>
  );
}

export default NavBar;
