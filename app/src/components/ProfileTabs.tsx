import { ProfileTabSelection } from '../types';
import Styles from './ProfileTabs.module.css';

type ProfileTabsProps = {
  setSelected: (tab: ProfileTabSelection) => void;
  selected: ProfileTabSelection;
};

function ProfileTabs({ setSelected, selected }: ProfileTabsProps) {
  return (
    <div className={Styles.tabContainer}>
      {(
        Object.keys(ProfileTabSelection) as Array<
          keyof typeof ProfileTabSelection
        >
      ).map((tab) => (
          <button
            key={tab}
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
                transform: `scaleX(${ProfileTabSelection[tab].length * (selected === ProfileTabSelection[tab] ? 18 : 0)})`,
              }}
            />
          </button>
      ))}
    </div>
  );
}

export default ProfileTabs;
