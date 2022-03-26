// import Styles from './ProfileWalls.module.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { FeedPost, v1 } from '../types';
import WallPost from './WallPost';

function ProfileWalls() {
  const params = useParams();

  const [selfRes, selfFetch] = useApi(v1.routes.selfGetUserWalls);
  const [otherRes, otherFetch] = useApi(v1.routes.userGetUserWalls);
  const [walls, setWalls] = useState<FeedPost[]>([]);

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
      setWalls(await res.json());
    };
    handleRes();
  }, [selfRes, otherRes]);
  return (
    <div>
      {walls.length > 0 ? (
        walls.map((wall) => (
          <WallPost
            key={wall.wallID}
            wallID={wall.wallID}
            ownerID={wall.ownerID}
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
