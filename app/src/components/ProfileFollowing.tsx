import { useEffect, useState } from 'react';
import fetchApi from '../app/fetchApi';
import { OtherUser, v1 } from '../types';
import ProfileImage from './ProfileImage';
import Styles from './ProfileFollowing.module.css';
import { useAppSelector } from '../app/hooks';
import UnfollowButton from './UnfollowButton';
import FollowButton from './FollowButton';

function ProfileFollowing({ user }: { user: OtherUser }) {
  const [following, setFollowing] = useState<OtherUser[]>([]);
  const currentUser = useAppSelector((state) => state.user.user);
  const [actualFollowing, setActualFollowing] = useState<OtherUser[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      if (!user) return;
      const res = await fetchApi(v1.routes.getFollowing, {
        params: [user.id.toString(10)],
      });
      if (res.status !== 200) return;
      const data = await res.json();
      setFollowing(data);
    };

    const getActualUserFollowing = async () => {
      if (!currentUser) return;
      const res = await fetchApi(v1.routes.getFollowing, {
        params: [currentUser.id.toString(10)],
      });
      if (res.status !== 200) return;
      const data = await res.json();
      setActualFollowing(data);
    };

    handleFetch();
    getActualUserFollowing();
  }, [user]);

  return (
    <div>
      {following.map((follower) => (
        <div key={follower.id} className={Styles.followingContainer}>
          <ProfileImage size={50} className={Styles.profilePhoto} />
          <p>[ {follower.username} ]</p>
          {/* eslint-disable-next-line no-nested-ternary */}
          {currentUser?.id !== follower.id ? (
            actualFollowing.find((u) => u.id === follower.id) ? (
              <UnfollowButton
                userID={follower.id}
                classList={Styles.followingButton}
                onClick={() => {
                  setActualFollowing(
                    actualFollowing.filter((u) => u.id !== follower.id),
                  );
                }}
              />
            ) : (
              <FollowButton
                userID={follower.id}
                classList={Styles.followingButton}
                onClick={() => {
                  setActualFollowing([...actualFollowing, follower]);
                }}
              />
            )
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default ProfileFollowing;
