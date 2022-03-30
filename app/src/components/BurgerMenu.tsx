import { useEffect, useRef, useState } from 'react';
import Styles from './BurgerMenu.module.css';
import SideBar from './SideBar';

function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (
        e.target instanceof HTMLElement &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div ref={ref}>
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
