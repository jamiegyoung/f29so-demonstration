import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchApi from '../app/fetchApi';
import { useAppSelector } from '../app/hooks';
import FollowButton from '../components/FollowButton';
import ProfileFollowing from '../components/ProfileFollowing';
import ProfileImage from '../components/ProfileImage';
import ProfileTabs from '../components/ProfileTabs';
import ProfileWalls from '../components/ProfileWalls';
import Spinner from '../components/Spinner';
import UnfollowButton from '../components/UnfollowButton';
import useApi from '../hooks/useApi';
import useDate from '../hooks/useDate';
import { v1, ProfileTabSelection, OtherUser } from '../types';
import Styles from './Profile.module.css';

function Profile() {
  const params = useParams();
  const [wallCreationRes, wallCreationFetch] = useApi(v1.routes.createWall);
  const [otherUser, setOtherUser] = useState<OtherUser | undefined>();
  const actualUser = useAppSelector((state) => state.user.user);
  const [paramUserId, setParamUserId] = useState<number | undefined>();
  const [selected, setSelected] = useState<ProfileTabSelection>(
    ProfileTabSelection.WALLS,
  );
  const navigate = useNavigate();
  const [confirmBan, setConfirmBan] = useState(false);
  const [allowBanClick, setAllowBanClick] = useState(true);
  const [timeoutTime, setTimeoutTime] = useState(5);

  useEffect(() => {
    if (params.userID !== undefined) {
      setParamUserId(parseInt(params.userID, 10));
      const handleFetchOther = async () => {
        if (!params.userID) return;
        const res = await fetchApi(v1.routes.user, {
          params: [params.userID],
        });
        if (res.status !== 200) return;
        const data = await res.json();
        setOtherUser(data);
      };
      handleFetchOther();
      return;
    }
    navigate(`/profile/${actualUser?.id}`, { replace: true });
  }, [params]);

  useEffect(() => {
    if (wallCreationRes?.status !== 200) {
      return;
    }
    const handleData = async () => {
      const data = await wallCreationRes.json();
      navigate(`/wall/${data.wallID}`);
    };
    handleData();
  }, [wallCreationRes]);

  const handleBanClick = async () => {
    if (confirmBan && paramUserId !== undefined) {
      const res = await fetchApi(v1.routes.banUser, {
        params: [paramUserId.toString(10)],
      });
      if (res.status !== 200) return;
      window.location.href = '/';
      return;
    }
    setConfirmBan(true);
    setAllowBanClick(false);
    setTimeoutTime(5);
  };

  useEffect(() => {
    let localTimeout = timeoutTime;
    const timeout = setInterval(() => {
      if (localTimeout > 1) {
        localTimeout -= 1;
        setTimeoutTime(localTimeout);
        return;
      }
      setTimeoutTime(0);
      setAllowBanClick(true);
    }, 1000);
    return () => {
      clearInterval(timeout);
    };
  }, [confirmBan]);

  return (
    <div className={Styles.profileContainer}>
      {otherUser ? (
        <div>
          <div className={Styles.userHeader}>
            <ProfileImage size={150} className={Styles.profileImage} />
            <div className={Styles.innerUserHeader}>
              <h1>[ {otherUser?.username} ]</h1>
              <p>joined {otherUser ? useDate(otherUser.joined) : ''}</p>
              <p>contributions: {otherUser?.contributionCount}</p>
            </div>
          </div>
          {otherUser?.id !== actualUser?.id && otherUser?.isFollower ? (
            <p
              style={{
                color: '#555',
                fontSize: '0.8rem',
              }}
            >
              {otherUser.username} is following you
            </p>
          ) : null}
          <div className={Styles.buttonContainer}>
            {actualUser?.id === otherUser?.id ? (
              <button
                onClick={() => wallCreationFetch()}
                className={Styles.createWallButton}
                type="button"
              >
                Create Wall
              </button>
            ) : null}
            {otherUser?.id !== actualUser?.id && !otherUser?.isFollowing ? (
              <FollowButton
                onClick={() => {
                  setOtherUser({ ...otherUser, isFollowing: true });
                }}
                userID={otherUser?.id}
              />
            ) : null}
            {otherUser?.id !== actualUser?.id && otherUser?.isFollowing ? (
              <UnfollowButton
                onClick={() => {
                  setOtherUser({ ...otherUser, isFollowing: false });
                }}
                userID={otherUser?.id}
              />
            ) : null}
            {paramUserId &&
            actualUser &&
            paramUserId !== actualUser.id &&
            actualUser.admin &&
            !otherUser.admin ? (
              <button
                type="button"
                disabled={!allowBanClick}
                className={Styles.banButton}
                onClick={() => handleBanClick()}
              >
                {confirmBan
                  ? `Are you sure? ${timeoutTime || ''}`
                  : 'Delete User'}
              </button>
            ) : null}
          </div>
          <ProfileTabs setSelected={setSelected} selected={selected} />
          {selected === ProfileTabSelection.WALLS ? (
            <ProfileWalls userID={otherUser?.id} />
          ) : null}
          {selected === ProfileTabSelection.FOLLOWING ? (
            <ProfileFollowing user={otherUser} />
          ) : null}
          {selected === ProfileTabSelection.LIKES ? (
            <p>The likes tab is being worked on, come back later!</p>
          ) : null}
        </div>
      ) : (
        <div className={Styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default Profile;
