import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';
import LFGPage from './pages/LFGPage';
import StatsPage from './pages/StatsPage';
import GameDetailPage from './pages/GameDetailPage';

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
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/"   element={<LandingPage />} />
      <Route path="/*"  element={<Layout />} />
    </Routes>
  );
}
