// import Styles from './ProfileWalls.module.css';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUserWallFeed } from '../features/feed/feedSlice';
import { FeedPost } from '../types';
import WallPost from './WallPost';

function ProfileWalls({ userID }: { userID: number }) {
  const feedData = useAppSelector((state) => state.feed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    feedData?.posts.map((post: FeedPost) => post);
  }, [feedData]);

  useEffect(() => {
    dispatch(fetchUserWallFeed({ userID }));
  }, []);

  return (
    <div>
      {feedData?.posts.length > 0 ? (
        feedData.posts.map((wall) => (
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
