import { useRoutes } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import WallEditor from '../components/WallEditor';
import styles from './AppFrame.module.css';
import Home from './Home';

const AppRoutes = () =>
  useRoutes([
    { path: '/home', element: <Home /> },
    { path: '/wall/:wallID', element: <WallEditor /> },
  ]);

function AppFrame(): JSX.Element {
  return (
    <div>
      <NavBar />
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
