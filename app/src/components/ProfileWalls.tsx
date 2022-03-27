// import Styles from './ProfileWalls.module.css';

import { useEffect, useState } from 'react';
import fetchApi from '../app/fetchApi';
import { FeedPost, v1 } from '../types';
import WallPost from './WallPost';

function ProfileWalls({ userID }: { userID: number | undefined }) {
  const [walls, setWalls] = useState<FeedPost[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      if (!userID) return;
      const res = await fetchApi(v1.routes.getUserWalls, {
        params: [userID.toString(10)],
      });
      if (res.status !== 200) return;
      const data = await res.json();
      setWalls(data);
    };
    handleFetch();
  }, [userID]);

  return (
    <div>
      {walls.length > 0 ? (
        walls.map((wall) => (
          <WallPost
            key={wall.wallID}
            wallID={wall.wallID}
            ownerID={wall.ownerID}
            ownerUsername={wall.ownerUsername}
            edits={wall.edits}
            likes={wall.likes}
            lastEdit={wall.lastEdit}
            liked={wall.liked}
            preview={wall.preview}
          />
        ))
      ) : (
        <p>Looks like there&apos;s nothing here!</p>
      )}
    </div>
  );
}

export default ProfileWalls;
