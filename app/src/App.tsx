import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import WallEditor from './components/WallEditor';
import { setWallID } from './features/wall/wallSlice';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setWallID(1));
  }, [])

  return (
    <div className="App">
      <WallEditor />
    </div>
  );
}

export default App;
