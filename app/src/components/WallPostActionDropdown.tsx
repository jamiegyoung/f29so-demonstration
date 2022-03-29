import { useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import { useAppSelector } from '../app/hooks';
import useApi from '../hooks/useApi';
import { v1 } from '../types';
import Styles from './WallPostActionDropdown.module.css';

function WallPostActionDropdown({
  wallID,
  ownerID,
}: {
  wallID: number;
  ownerID: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const user = useAppSelector((state) => state.user.user);
  const [deleteApiRes, deleteApiFetch] = useApi(v1.routes.deleteWall);
  const [, reportApiFetch] = useApi(v1.routes.reportWall);

  useEffect(() => {
    if (deleteApiRes && deleteApiRes.status === 200) {
      window.location.reload();
    }
  }, [deleteApiRes]);

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

  const options = [
    {
      label: 'report',
      condition: user?.id !== ownerID,
      action: () => {
        reportApiFetch({ params: [wallID.toString(10)] });
      },
    },
    {
      label: 'delete',
      condition: user?.admin || user?.id === ownerID,
      action: () => {
        deleteApiFetch({ params: [wallID.toString(10)] });
      },
    },
    {
      label: 'copy link',
      condition: true,
      action: () => {
        copy(`${window.location.origin}/wall/${wallID}`);
      },
    },
  ];

  return (
    <div className={Styles.actionContainer}>
      <button
        className={Styles.button}
        type="button"
        onClick={() => toggleOpen()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 0 24 24"
          width="36px"
          fill="#FFFFFF"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
      <div
        ref={ref}
        className={[Styles.dropdownContent, open ? Styles.open : ''].join(' ')}
      >
        {options.map((o) =>
          o.condition ? (
            <button
              className={Styles.dropdownButton}
              onClick={() => {
                o.action();
                setOpen(false);
              }}
              type="button"
              key={o.label}
            >
              {o.label}
            </button>
          ) : null,
        )}
      </div>
    </div>
  );
}

export default WallPostActionDropdown;
