import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import Board from './pages/Board';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  const guard = (el) => (user ? el : <Navigate to="/login" replace />);
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={guard(<Boards />)} />
      <Route path="/board/:id" element={guard(<Board />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
