type ProfileImageProps = {
  src: string;
};

function ProfileImage({ src }: ProfileImageProps) {
  return (
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
  );
}

export default ProfileImage;
