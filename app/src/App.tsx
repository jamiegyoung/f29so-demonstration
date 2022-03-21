import { BrowserRouter, useRoutes } from 'react-router-dom';
import Login from './routes/Login';
import AppFrame from './routes/AppFrame';

const AppRoutes = () =>
  useRoutes([
    { path: '/*', element: <AppFrame /> },
    { path: '/login', element: <Login /> },
  ]);

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
