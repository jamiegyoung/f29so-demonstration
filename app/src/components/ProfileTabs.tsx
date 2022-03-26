import { useEffect } from 'react';
import { ProfileTabSelection } from '../types';
import Styles from './ProfileTabs.module.css';

type ProfileTabsProps = {
  setSelected: (tab: ProfileTabSelection) => void;
  selected: ProfileTabSelection;
};

function ProfileTabs({ setSelected, selected }: ProfileTabsProps) {
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <div className={Styles.tabContainer}>
      {(
        Object.keys(ProfileTabSelection) as Array<
          keyof typeof ProfileTabSelection
        >
      ).map((tab) => (
          <button
            type="button"
            onClick={() => setSelected(ProfileTabSelection[tab])}
            className={[
              Styles.button,
              selected === ProfileTabSelection[tab] ? Styles.selected : '',
            ].join(' ')}
          >
            {ProfileTabSelection[tab]}
            <div
              className={[
                Styles.bottomBorder,
                selected === ProfileTabSelection[tab] ? Styles.selected : '',
              ].join(' ')}
              style={{
                transform: `scaleX(${ProfileTabSelection[tab].length * 18})`,
              }}
            />
          </button>
      ))}
    </div>
  );
}

export default ProfileTabs;
