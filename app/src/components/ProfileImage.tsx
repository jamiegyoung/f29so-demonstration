import { Link } from 'react-router-dom';

type ProfileImageProps = {
  src: string;
};

function ProfileImage({ src }: ProfileImageProps) {
  return (
    <Link
      to="/profile"
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        style={{
          borderRadius: '50%',
          border: '2px solid #121212',
        }}
        src={src}
        alt="user icon"
        width={50}
        height={50}
      />
    </Link>
  );
}

export default ProfileImage;
