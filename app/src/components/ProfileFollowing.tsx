import { useEffect, useState } from 'react';
import fetchApi from '../app/fetchApi';
import { OtherUser, v1 } from '../types';
import ProfileImage from './ProfileImage';

function ProfileFollowing({ user }: { user: OtherUser }) {
  const [followers, setFollowers] = useState<OtherUser[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      if (!user) return;
      const res = await fetchApi(v1.routes.getFollowers, {
        params: [user.id.toString(10)],
      });
      if (res.status !== 200) return;
      const data = await res.json();
      setFollowers(data);
    };
    handleFetch();
  }, []);

  return (
    <div>
      {followers.map((follower) => (
        <div>
          <ProfileImage size={50} />
          <p>{follower.username}</p>
        </div>
      ))}
    </div>
  );
}

export default ProfileFollowing;
