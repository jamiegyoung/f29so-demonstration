import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';
import { FeedPost } from '../types';
import styles from './WallPost.module.css';
import LikeButton from './LikeButton';
import useDate from '../hooks/useDate';

function WallPost({
  wallID,
  // owner,
  edits,
  // likes,
  lastEdit,
  preview,
}: FeedPost) {
  const [image, setImage] = useState<string | undefined>(undefined);
  const randomNames = ['jamie', 'crispin', 'stan', 'connor', 'ralf', 'nimer'];

  useEffect(() => {
    if (preview) {
      setImage(Buffer.from(preview).toString('base64'));
    }
  }, [preview]);

  return (
    <div className={styles.wallPost}>
      <div className={styles.leftContainer}>
        <img
          src={`data:image/png;base64,${image || ''}`}
          alt="wall preview"
          className={styles.wallPreview}
        />
        <Link className={styles.contributeButton} to={`/wall/${wallID}`}>
          <svg
            className={styles.buttonIcon}
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 0 24 24"
            width="32px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
          </svg>
          contribute
        </Link>
      </div>
      <div className={styles.wallPostData}>
        <h1>
          [ {randomNames[Math.floor(Math.random() * randomNames.length)]} ]
        </h1>
        <p>last edited: {useDate(Number.parseInt(lastEdit, 10))}</p>
        <p>edits: {edits}</p>
        <div className={styles.bottomRightContainer}>
          <LikeButton wallID={wallID} />
          <button className={styles.moreInfoButton} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="36px"
              viewBox="0 0 24 24"
              width="36px"
              fill="#FFFFFF"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WallPost;
