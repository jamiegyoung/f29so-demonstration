import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Wall from '../features/wall/Wall';
import styles from './WallEditor.module.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearEditingPixel,
  clearWall,
  setPixel,
  setWall,
  setWallID,
  setWallStatus,
} from '../features/wall/wallSlice';
import PixelEditor from './PixelEditor';
import useSocket from '../hooks/useSocket';
import { Pixel, Wall as WallType } from '../types';

function WallEditor() {
  const dispatch = useAppDispatch();
  const wallSelector = useAppSelector((state) => state.wall);

  // convert to useSocket
  const [socket, setSocket] = useSocket();

  type StatusText = 'Loading' | 'Editing' | 'Saving' | 'Error Loading';

  const [statusText, setStatusText] = useState<StatusText>('Loading');

  const params = useParams();

  useEffect(() => {
    const { wallID } = params;
    if (!wallID) return;
    const idInt = parseInt(wallID, 10);
    if (Number.isNaN(idInt)) return;
    dispatch(setWallID(idInt));
  }, [params]);

  useEffect(() => {
    if (!wallSelector.id) return;
    setSocket({
      uri: `/walls`,
      opts: {
        query: {
          wall: wallSelector.id,
        },
      },
    });
  }, [setSocket, wallSelector.id]);

  useEffect(() => {
    switch (wallSelector.status) {
      case 'loading':
        setStatusText('Loading');
        break;
      case 'success':
        setStatusText('Editing');
        break;
      case 'error':
        setStatusText('Error Loading');
        break;
      default:
        setStatusText('Loading');
    }
  }, [wallSelector.status]);

  useEffect(() => {
    if (!socket) return undefined;

    socket.on('connected', (data: WallType) => {
      dispatch(setWall(data));
      dispatch(setWallStatus('success'));
    });

    socket.on('error', (err) => {
      console.log('error', err);
      dispatch(setWallStatus('error'));
    });

    socket.on('connect_error', () => {
      dispatch(setWallStatus('error'));
    });

    socket.on('pixel-edit', (data: Pixel) => {
      dispatch(setPixel(data));
    });

    return () => {
      socket.close();
      dispatch(clearWall());
    };
  }, [socket]);

  const handlePixelEdit = (pixel: Pixel) => {
    if (!socket) return;
    dispatch(clearEditingPixel());
    socket.emit('pixel-edit', pixel);
  };

  return (
    <div className={styles.wallEditorContainer}>
      <h1
        style={{
          margin: 0,
        }}
      >
        {statusText === 'Loading'
          ? 'Loading...'
          : `${statusText} ${wallSelector.wall?.ownerUsername}'s WALL`}
      </h1>
      <div>
        <Wall />
        {wallSelector.editingPixel ? (
          <PixelEditor onApply={handlePixelEdit} />
        ) : null}
      </div>
    </div>
  );
}

export default WallEditor;
