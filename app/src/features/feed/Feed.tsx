import { useEffect } from 'react';
import styles from './Feed.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearFeed, fetchUserFeed } from './feedSlice';
import { FeedPost } from '../../types';
import WallPost from '../../components/WallPost';
import Spinner from '../../components/Spinner';

function Feed() {
  const feedData = useAppSelector((state) => state.feed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    feedData?.posts.map((post: FeedPost) => post);
  }, [feedData]);

  useEffect(() => {
    dispatch(clearFeed());
    dispatch(fetchUserFeed({ page: 0 }));
  }, []);

  return (
    <div className={styles.feed}>
      {feedData.status === 'success' && feedData.posts.length > 0
        ? feedData?.posts.map((post: FeedPost) => (
            <WallPost
              key={post.wallID}
              wallID={post.wallID}
              ownerID={post.ownerID}
              ownerUsername={post.ownerUsername}
              edits={post.edits}
              likes={post.likes}
              lastEdit={post.lastEdit}
              preview={post.preview}
              liked={post.liked}
            />
          ))
        : null}
      {feedData.status === 'success' && feedData.posts.length === 0 ? (
        <p>
          Looks like there&apos;s nothing here! You can start by creating a new
          wall or by following someone.
        </p>
      ) : null}
      {feedData.status === 'error' ? (
        <p>There was an error fetching these WALLS. Please try again later.</p>
      ) : null}
      {feedData.status === 'loading' ? <Spinner /> : null}
    </div>
  );
}

export default Feed;
