import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { GuestRoute, ProtectedRoute } from './components/RouteGuards';
import Welcome from './pages/Welcome';
import AuthPage from './pages/AuthPage';
import Workspace from './pages/Workspace';
import './App.css';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/app/all' : '/welcome'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Navigate to="/app/all" replace />} />
          <Route path="/app/:filter" element={<Workspace />} />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
