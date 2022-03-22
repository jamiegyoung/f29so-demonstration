import { BrowserRouter, useRoutes } from 'react-router-dom';
import Login from './routes/Login';
import AppFrame from './routes/AppFrame';
import Registration from './routes/Registration';

const AppRoutes = () =>
  useRoutes([
    { path: '/*', element: <AppFrame /> },
    { path: '/login', element: <Login /> },
    { path: '/registration', element: <Registration /> },
  ]);

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
