import { Link } from 'react-router-dom';
import icon from './256x256 icon.jpg';

interface ProfileImageProps {
  size: number;
  className?: string;
}

function ProfileImage({ size, className }: ProfileImageProps) {
  return (
    <Link
      to="/profile"
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      className={className}
    >
      <img
        style={{
          borderRadius: '50%',
          border: '2px solid #121212',
        }}
        src={icon}
        alt="user icon"
        width={size}
        height={size}
      />
    </Link>
  );
}

ProfileImage.defaultProps = {
  className: '',
};

export default ProfileImage;
