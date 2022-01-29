import { Link } from 'react-router-dom';
import { FeedPost } from '../types';
import styles from './WallPost.module.css';

function WallPost({ wallID, owner, edits, likes, lastEdit }: FeedPost) {
  return (
    <Link to={`/wall/${wallID}`} className={styles.wallPost}>
      <p>WallID: {wallID}</p>
      <p>Owner: {owner}</p>
      <p>Edits: {edits}</p>
      <p>Likes: {likes}</p>
      <p>Last edit: {lastEdit}</p>
    </Link>
  );
}

export default WallPost;
