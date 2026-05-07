import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import GameCard from '../components/GameCard';
import StarRating from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { useSearch } from '../hooks/useSearch';
import { useLibrary } from '../hooks/useLibrary';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [view, setView]               = useState("grid");
  const [sortBy, setSortBy]           = useState("title");
  const [addOpen, setAddOpen]         = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { library, loading, addGameToLibrary, updateGameStatus, deleteGame } = useLibrary();
  const { results: searchResults, isLoading } = useSearch(searchQuery);

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

  // [수정] 가짜 데이터를 찾는 handleSearch 함수 삭제 (setSearchQuery만 유지)

  const addGame = async (game) => {
    const ok = await addGameToLibrary(game);
    if (ok) {
      setAddOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div>
      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#a855f7" }}>라이브러리 불러오는 중...</div>
      )}

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

      {/* ... (중간 탭 및 정렬 버튼 생략 - 기존과 동일) ... */}

      {/* 게임 목록 렌더링 (그리드/리스트) */}
      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 14 }}>
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} onOpen={(game) => navigate(`/game/${game.rawg_id}`)} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((g) => (
            <GlassCard
              key={g.id}
              style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}
              onClick={() => navigate(`/game/${g.rawg_id}`)}
            >
              <img src={g.cover} alt={g.title} style={{ width: 48, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{g.title}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <StatusBadge status={g.status} />
                  {g.genre && g.genre.map((ge) => ( // [수정] 데이터 존재 여부 체크 추가
                    <span key={ge} style={{ fontSize: 11, color: "var(--text3)", background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "1px 6px" }}>{ge}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteGame(g.id); }}
                style={{ padding: "4px 8px", borderRadius: 6, background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 12, flexShrink: 0 }}
              >
                삭제
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* [수정] 게임 추가 모달 - 실시간 API 연동 파트 */}
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
                onChange={(e) => setSearchQuery(e.target.value)} // [수정] 직접 상태 업데이트
                placeholder="RAWG에서 게임 검색…"
                style={{ width: "100%", background: "rgba(8,9,15,0.8)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 10, padding: "10px 12px 10px 36px", color: "var(--text)", fontSize: 14, outline: "none" }}
              />
            </div>

            {/* [추가] 로딩 상태 표시 */}
            {isLoading && (
              <div style={{ textAlign: "center", padding: "20px", color: "#a855f7" }}>데이터를 불러오는 중...</div>
            )}

            {/* 검색 결과 표시 (실제 API 데이터) */}
            {!isLoading && searchResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "300px", overflowY: "auto" }}>
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
            
            {!isLoading && searchQuery && searchResults.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: "20px 0", fontSize: 13 }}>No results. Try another title.</div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}