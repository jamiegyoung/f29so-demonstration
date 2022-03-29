import { useState } from 'react';
import Styles from './BurgerMenu.module.css';
import SideBar from './SideBar';

function BurgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className={[Styles.button, open ? Styles.open : ''].join(' ')}
      >
        <div className={Styles.section} />
        <div className={Styles.section} />
        <div className={Styles.section} />
      </button>
      <div className={[Styles.menu, open ? Styles.open : ''].join(' ')}>
        <SideBar />
      </div>
    </div>
  );
}

export default BurgerMenu;
