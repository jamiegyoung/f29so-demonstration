import Styles from './FollowUnfollow.module.css';
import fetchApi from '../app/fetchApi';
import { v1 } from '../types';

function UnfollowButton({
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
        fetchApi(v1.routes.unfollow, {
          params: [userID.toString(10)],
        });
        if (onClick) onClick();
      }}
      className={[classList, Styles.button].join(' ')}
      type="button"
    >
      Unfollow
    </button>
  );
}

UnfollowButton.defaultProps = {
  onClick: undefined,
  classList: undefined,
};

export default UnfollowButton;
