import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';
import LFGPage from './pages/LFGPage';
import StatsPage from './pages/StatsPage';
import GameDetailPage from './pages/GameDetailPage';
import PublicProfilePage from './pages/PublicProfilePage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        <Routes>
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/library"    element={<LibraryPage />} />
          <Route path="/profile"    element={<ProfilePage />} />
          <Route path="/lfg"        element={<LFGPage />} />
          <Route path="/stats"      element={<StatsPage />} />
          <Route path="/game/:id"   element={<GameDetailPage />} />
          <Route path="/:userId"    element={<PublicProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/*" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
    </Routes>
  );
}
