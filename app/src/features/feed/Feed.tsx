import { useEffect, useState } from 'react';
import WallPost from '../../components/WallPost';
import styles from './Feed.module.css';
import useApi from '../../hooks/useApi';
import { v1, FeedPost } from '../../types';

function feed() {
  const [feedData, setFeedData] = useState<null | FeedPost[]>([]);
  const apiData = useApi(v1.routes.getFeed, '1');
  useEffect(() => {
    const setApiData = async () => {
      if (apiData?.status === 200) {
        setFeedData(await apiData.json());
      }
    };
    setApiData();
  }, [apiData]);

  console.log(feedData);

  return (
    <div className={styles.feed}>
      {feedData?.map((post: FeedPost) => (
        <WallPost
          key={post.wallID}
          wallID={post.wallID}
          owner={post.owner}
          edits={post.edits}
          likes={post.likes}
          lastEdit={post.lastEdit}
        />
      ))}
    </div>
  );
}

export default feed;
