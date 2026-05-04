import { useState, useMemo, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import GameCard from '../components/GameCard';
import StarRating from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import mockData from '../data/mockData';

export default function LibraryPage({ setSelectedGame, setPage }) {
  const [filter, setFilter]               = useState("all");
  const [search, setSearch]               = useState("");
  const [view, setView]                   = useState("grid");
  const [sortBy, setSortBy]               = useState("title");
  const [library, setLibrary]             = useState(mockData.library);
  const [addOpen, setAddOpen]             = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery]     = useState("");

  const tabs = [
    { id: "all",       label: "All",       count: library.length },
    { id: "playing",   label: "Playing",   count: library.filter((g) => g.status === "playing").length },
    { id: "completed", label: "Completed", count: library.filter((g) => g.status === "completed").length },
    { id: "backlog",   label: "Backlog",   count: library.filter((g) => g.status === "backlog").length },
    { id: "dropped",   label: "Dropped",   count: library.filter((g) => g.status === "dropped").length },
  ];

  const filtered = useMemo(() => {
    let res = library;
    if (filter !== "all") res = res.filter((g) => g.status === filter);
    if (search) res = res.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "title")      res = [...res].sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "rating")     res = [...res].sort((a, b) => b.rating - a.rating);
    if (sortBy === "hours")      res = [...res].sort((a, b) => b.hours - a.hours);
    if (sortBy === "metacritic") res = [...res].sort((a, b) => b.metacritic - a.metacritic);
    return res;
  }, [library, filter, search, sortBy]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    if (!q) { setSearchResults([]); return; }
    const mock = [
      { id: 101, title: "Hollow Knight: Silksong", cover: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg", metacritic: 0,  year: 2024 },
      { id: 102, title: "Black Myth: Wukong",      cover: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg", metacritic: 82, year: 2024 },
      { id: 103, title: "Palworld",                cover: "https://media.rawg.io/media/games/479/479c2b8ba9370eff7bb7a5a0ab8c80b0.jpg", metacritic: 73, year: 2024 },
    ].filter((g) => g.title.toLowerCase().includes(q.toLowerCase()));
    setSearchResults(mock);
  }, []);

  const addGame = (game) => {
    setLibrary((prev) => [{ ...game, status: "backlog", rating: 0, hours: 0, genre: ["Unknown"], platform: "Steam" }, ...prev]);
    setAddOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div>
      <TopBar
        title="My Library"
        subtitle={`${library.length} games tracked`}
        searchVal={search}
        onSearch={setSearch}
        actions={
          <button
            onClick={() => setAddOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}
          >
            <Icon name="plus" size={15} /> Add Game
          </button>
        }
      />

      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(14,15,26,0.5)", borderRadius: 12, padding: 4, border: "1px solid rgba(124,58,237,0.12)", width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            style={{ padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: filter === t.id ? 700 : 400, background: filter === t.id ? "rgba(124,58,237,0.2)" : "transparent", color: filter === t.id ? "#c084fc" : "var(--text3)", border: filter === t.id ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent", transition: "all 0.15s" }}
          >
            {t.label} <span style={{ opacity: 0.6, fontSize: 11, marginLeft: 3 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>{filtered.length} games</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ background: "rgba(14,15,26,0.8)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 8, padding: "5px 10px", color: "var(--text2)", fontSize: 12, outline: "none" }}
          >
            <option value="title">Title A–Z</option>
            <option value="rating">Rating</option>
            <option value="hours">Hours</option>
            <option value="metacritic">Metacritic</option>
          </select>
          {["grid", "list"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ padding: 6, borderRadius: 7, background: view === v ? "rgba(124,58,237,0.2)" : "transparent", color: view === v ? "#a855f7" : "var(--text3)" }}
            >
              <Icon name={v} size={15} />
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 14 }}>
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} onOpen={(game) => { setSelectedGame(game); setPage("gameDetail"); }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((g) => (
            <GlassCard
              key={g.id}
              style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}
              onClick={() => { setSelectedGame(g); setPage("gameDetail"); }}
            >
              <img src={g.cover} alt={g.title} style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{g.title}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <StatusBadge status={g.status} />
                  {g.genre.map((ge) => (
                    <span key={ge} style={{ fontSize: 11, color: "var(--text3)", background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "1px 6px" }}>{ge}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                {g.metacritic > 0 && (
                  <div style={{ background: g.metacritic >= 90 ? "#22c55e" : g.metacritic >= 75 ? "#f59e0b" : "#ef4444", color: "#000", borderRadius: 6, padding: "2px 7px", fontSize: 11, fontWeight: 800 }}>
                    {g.metacritic}
                  </div>
                )}
                {g.hours > 0 && <div style={{ fontSize: 12, color: "var(--text3)" }}>{g.hours}h</div>}
                <StarRating value={g.rating} readOnly />
                <Icon name="chevronRight" size={14} style={{ color: "var(--text3)" }} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {addOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}
        >
          <GlassCard style={{ width: 480, padding: 28, border: "1px solid rgba(124,58,237,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 18 }}>게임 추가</h3>
              <button onClick={() => setAddOpen(false)}><Icon name="x" size={18} style={{ color: "var(--text3)" }} /></button>
            </div>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Icon name="search" size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
              <input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="RAWG에서 게임 검색…"
                style={{ width: "100%", background: "rgba(8,9,15,0.8)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 10, padding: "10px 12px 10px 36px", color: "var(--text)", fontSize: 14, outline: "none" }}
              />
            </div>
            {searchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {searchResults.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => addGame(g)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: 10, cursor: "pointer" }}
                  >
                    <img src={g.cover} alt={g.title} style={{ width: 36, height: 48, objectFit: "cover", borderRadius: 6 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{g.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text3)" }}>{g.year}{g.metacritic > 0 ? ` · MC ${g.metacritic}` : " · TBD"}</div>
                    </div>
                    <Icon name="plus" size={16} style={{ color: "#a855f7" }} />
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: "20px 0", fontSize: 13 }}>No results. Try another title.</div>
            )}
            {!searchQuery && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text3)" }}>
                <div>💡 <strong style={{ color: "var(--text2)" }}>RAWG API</strong> 연동으로 게임 데이터를 자동으로 불러옵니다</div>
                <div>· 게임 제목, 포스터, 장르, 메타스코어 자동 파싱</div>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
