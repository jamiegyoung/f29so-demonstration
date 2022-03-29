import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';
import { FeedPost, v1 } from '../types';
import Styles from './WallPost.module.css';
import useDate from '../hooks/useDate';
import fetchApi from '../app/fetchApi';

function ReportPost({ wallID, ownerID, edits, lastEdit, preview }: FeedPost) {
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (preview) {
      setImage(Buffer.from(preview).toString('base64'));
    }
  }, [preview]);

  return (
    <div className={Styles.wallPost}>
      <div className={Styles.leftContainer}>
        <img
          src={`data:image/png;base64,${image || ''}`}
          alt="wall preview"
          className={Styles.wallPreview}
        />
        <Link className={Styles.contributeButton} to={`/wall/${wallID}`}>
          <svg
            className={Styles.buttonIcon}
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
      <div className={Styles.wallPostData}>
        <p>last edited: {useDate(lastEdit)}</p>
        <p>edits: {edits}</p>
        <div className={Styles.bottomRightContainer}>
          <button
            onClick={async () => {
              const res = await fetchApi(v1.routes.removeReport, {
                params: [wallID.toString(10)],
              });
              if (res.status === 200) {
                window.location.reload();
              }
            }}
            type="button"
          >
            Remove from reports
          </button>
          <button
            onClick={async () => {
              const res = await fetchApi(v1.routes.deleteWall, {
                params: [wallID.toString(10)],
              });
              if (res.status === 200) {
                window.location.reload();
              }
            }}
            type="button"
          >
            Delete WALL
          </button>
          <button
            onClick={async () => {
              const res = await fetchApi(v1.routes.deleteUser, {
                params: [ownerID.toString(10)],
              });
              if (res.status === 200) {
                window.location.reload();
              }
            }}
            style={{ backgroundColor: 'red', color: 'white' }}
            type="button"
          >
            Delete user
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPost;
