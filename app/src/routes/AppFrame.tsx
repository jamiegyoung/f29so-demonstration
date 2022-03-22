import { useEffect } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUser } from '../features/user/userSlice';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import WallEditor from '../components/WallEditor';
import styles from './AppFrame.module.css';
import Home from './Home';

const AppRoutes = () =>
  useRoutes([
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/wall/:wallID', element: <WallEditor /> },
  ]);

function AppFrame() {
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  useEffect(() => {
    if (userData.status === 'error') navigate('/login', { replace: true });
  });

  return (
    <div>
      <NavBar
        userName={userData.user?.username}
        contributions={userData.user?.contributionCount}
        joined={userData.user?.joined}
      />
      <div className={styles.container}>
        <div className={styles.mainStrip}>
          <SideBar />
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}

export default AppFrame;
