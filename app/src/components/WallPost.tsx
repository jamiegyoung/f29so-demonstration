import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';
import { FeedPost } from '../types';
import styles from './WallPost.module.css';

function WallPost({
  wallID,
  owner,
  edits,
  likes,
  lastEdit,
  preview,
}: FeedPost) {
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (preview) {
      setImage(Buffer.from(preview).toString('base64'));
    }
  }, [preview]);

  return (
    <Link to={`/wall/${wallID}`} className={styles.wallPost}>
      <img
        src={`data:image/png;base64,${image || ''}`}
        width={128}
        height={128}
        alt="wall preview"
        className={styles.wallPreview}
      />
      <div className={styles.wallPostData}>
        <p>WallID: {wallID}</p>
        <p>Owner: {owner}</p>
        <p>Edits: {edits}</p>
        <p>Likes: {likes}</p>
        <p>Last edit: {lastEdit}</p>
      </div>
    </Link>
  );
}

export default WallPost;
