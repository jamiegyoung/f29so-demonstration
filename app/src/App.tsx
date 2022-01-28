import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WallEditor from './components/WallEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/wall/:wallID" element={<WallEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
