import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setLikes } from '../features/feed/feedSlice';
import useApi from '../hooks/useApi';
import { v1 } from '../types';
import styles from './LikeButton.module.css';

function LikeButton({ wallID }: { wallID: number }) {
  // defaulting userid to 1 for now
  const [res, fetch] = useApi(v1.routes.addLike);

  const likes = useAppSelector(
    (state) => state.feed.posts.find((post) => post.wallID === wallID)?.likes,
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleLike = async () => {
      if (res?.status !== 200) return;
      const data = await res.json();
      dispatch(setLikes({ wallID, likes: Number.parseInt(data, 10) }));
    };
    handleLike();
  }, [res]);

  return (
    <div
      className={styles.likeButtonContainer}
    >
      <button
        type="button"
        onClick={() => {
          fetch(wallID.toString(), '1');
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 0 24 24"
          width="36px"
          fill="#FFFFFF"
        >
          <path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
          <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
        </svg>
      </button>
      <p>{likes}</p>
    </div>
  );
}

export default LikeButton;
