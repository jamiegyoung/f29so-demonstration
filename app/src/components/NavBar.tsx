import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import Logo from './Logo';
import icon from './256x256 icon.jpg';
import Search from './Search';
import ProfileImage from './ProfileImage';

function NavBar() {
  const userName = 'JCR';
  return (
    <div className={styles.bar}>
      <Link to="/" className={`${styles.logoFormat} no-select`}>
        <Logo size={0.25} />
        <h1>WALLS</h1>
      </Link>
      <div className={styles.stripContainer}>
        <Search />
        <div className={styles.profileContainer}>
          <ProfileImage src={icon} />
          <div className={`${styles.profileInfoContainer} no-select`}>
            <p style={{ color: '#EDEEF0', fontWeight: '500' }}>
              [ {userName} ]
            </p>
            <p>joined 21-11-10</p>
            <p>contributions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
