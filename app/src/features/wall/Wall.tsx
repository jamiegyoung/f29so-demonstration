// import { useAppSelector, useAppDispatch } from '../../app/hooks';
// import { fetchWall, setPixel } from './wallSlice';

type WallProps = {
  wallID: number;
};

function Wall({ wallID: wallID }: WallProps) {
  return (
    <div>
      <h1>Wall {wallID}</h1>
    </div>
  );
}

export default Wall;
