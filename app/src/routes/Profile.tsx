import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileImage from '../components/ProfileImage';
import ProfileTabs from '../components/ProfileTabs';
import ProfileWalls from '../components/ProfileWalls';
import useApi from '../hooks/useApi';
import useDate from '../hooks/useDate';
import { User, v1, ProfileTabSelection } from '../types';
import Styles from './Profile.module.css';

function Profile() {
  const params = useParams();
  const [otherRes, otherFetch] = useApi(v1.routes.user);
  const [selfRes, selfFetch] = useApi(v1.routes.selfUser);
  const [user, setUser] = useState<User | undefined>();
  const [selected, setSelected] = useState<ProfileTabSelection>(
    ProfileTabSelection.WALLS,
  );

  useEffect(() => {
    if (params.userID !== undefined) {
      otherFetch({ params: [params.userID] });
      return;
    }
    selfFetch();
  }, []);

  useEffect(() => {
    const res = selfRes || otherRes;
    if (res === undefined || res === null) return;
    if (res.status !== 200) return;

    const handleRes = async () => {
      setUser(await res.json());
    };

    handleRes();
  }, [selfRes, otherRes]);

  return (
    <div className={Styles.profileContainer}>
      <div className={Styles.userHeader}>
        <ProfileImage size={150} className={Styles.profileImage} />
        <div className={Styles.innerUserHeader}>
          <h1>[ {user?.username} ]</h1>
          <p>joined {user ? useDate(user.joined) : ''}</p>
          <p>contributions: {user?.contributionCount}</p>
        </div>
      </div>
      <ProfileTabs setSelected={setSelected} selected={selected} />
      {selected === ProfileTabSelection.WALLS ? <ProfileWalls /> : null}
      {selected === ProfileTabSelection.FOLLOWING ? <div>poogger2s</div> : null}
    </div>
  );
}

export default Profile;
