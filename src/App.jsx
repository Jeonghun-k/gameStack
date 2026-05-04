import { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/ProfilePage';
import LFGPage from './pages/LFGPage';
import StatsPage from './pages/StatsPage';
import GameDetailPage from './pages/GameDetailPage';

export default function App() {
  const [page, setPage]               = useState("landing");
  const [selectedGame, setSelectedGame] = useState(null);

  if (page === "landing") {
    return <LandingPage onEnter={() => setPage("dashboard")} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar page={page === "gameDetail" ? "library" : page} setPage={setPage} />
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {page === "dashboard"  && <Dashboard setPage={setPage} setSelectedGame={setSelectedGame} />}
        {page === "library"    && <LibraryPage setSelectedGame={setSelectedGame} setPage={setPage} />}
        {page === "profile"    && <ProfilePage />}
        {page === "lfg"        && <LFGPage />}
        {page === "stats"      && <StatsPage />}
        {page === "gameDetail" && <GameDetailPage game={selectedGame} goBack={() => setPage("library")} />}
      </main>
    </div>
  );
}
