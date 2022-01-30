import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Wall from '../features/wall/Wall';
import styles from './WallEditor.module.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearEditingPixel,
  setPixel,
  setWall,
  setWallID,
  setWallStatus,
} from '../features/wall/wallSlice';
import PixelEditor from './PixelEditor';
import getServerURI from '../app/serverURI';
import useSocket from '../hooks/useSocket';
import { LocalPixel, Wall as WallType } from '../types';

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
    // // deliberately throttle loading to see spinner
    // // TODO: remove after demonstration
    // setTimeout(() => {
    if (!wallSelector.id) return;
    setSocket({
      uri: `${getServerURI()}/walls`,
      opts: {
        query: {
          wall: wallSelector.id,
        },
      },
    });
    // }, 3000);
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

    socket.on('pixel-edit', (data: LocalPixel) => {
      dispatch(setPixel(data));
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  const handlePixelEdit = (pixel: LocalPixel) => {
    if (!socket) return;
    dispatch(setPixel(pixel));
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
        {statusText} WALL {wallSelector.id || 'unknown'}
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
