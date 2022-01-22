// import { useAppSelector, useAppDispatch } from '../../app/hooks';
// import { fetchWall, setPixel } from './wallSlice';

type WallProps = {
  wallId: number;
};

function Wall({ wallId }: WallProps) {
  return (
    <div>
      <h1>Wall {wallId}</h1>
    </div>
  );
}

export default Wall;
