import { useEffect } from 'react';
import styles from './Feed.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUserFeed } from './feedSlice';
import { FeedPost } from '../../types';
import WallPost from '../../components/WallPost';

function Feed() {
  const feedData = useAppSelector((state) => state.feed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('yo');
    console.log(feedData);
    feedData?.posts.map((post: FeedPost) => post);
  }, [feedData]);

  useEffect(() => {
    console.log('dispatching feed');
    dispatch(fetchUserFeed({ page: 0 }));
  }, []);

  return (
    <div className={styles.feed}>
      {feedData?.posts.map((post: FeedPost) => (
        <WallPost
          key={post.wallID}
          wallID={post.wallID}
          owner={post.owner}
          edits={post.edits}
          likes={post.likes}
          lastEdit={post.lastEdit}
          preview={post.preview}
          liked={post.liked}
        />
      ))}
    </div>
  );
}

export default Feed;
