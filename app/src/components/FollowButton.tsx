import Styles from './FollowUnfollow.module.css';
import fetchApi from '../app/fetchApi';
import { v1 } from '../types';

function FollowButton({
  onClick,
  userID,
  classList,
}: {
  onClick?: () => void;
  userID: number;
  classList?: string;
}) {
  return (
    <button
      onClick={() => {
        fetchApi(v1.routes.follow, {
          params: [userID.toString(10)],
        });
        if (onClick) onClick();
      }}
      className={[classList, Styles.button].join(' ')}
      type="button"
    >
      Follow
    </button>
  );
}

FollowButton.defaultProps = {
  onClick: undefined,
  classList: undefined,
};

export default FollowButton;
