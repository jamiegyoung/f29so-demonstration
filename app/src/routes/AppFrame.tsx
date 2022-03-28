import { useEffect } from 'react';
// import { useRoutes, useNavigate } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchUser } from '../features/user/userSlice';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import WallEditor from '../components/WallEditor';
import styles from './AppFrame.module.css';
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import Reports from './Reports';

const AppRoutes = () =>
  useRoutes([
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/wall/:wallID', element: <WallEditor /> },
    { path: '/profile/:userID', element: <Profile /> },
    { path: '/profile', element: <Profile /> },
    { path: '/trending', element: <div>Trending</div> },
    { path: '/saved', element: <div>Saved</div> },
    { path: '/settings', element: <Settings /> },
    { path: '/reports', element: <Reports />}
  ]);

function AppFrame() {
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  // TODO: enable before production
  // useEffect(() => {
  //   if (userData.status === 'error') navigate('/login', { replace: true });
  // }, [userData]);

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
