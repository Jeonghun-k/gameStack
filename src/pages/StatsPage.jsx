import { useMemo } from 'react';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { useLibrary } from '../hooks/useLibrary';

const GENRE_COLORS = ["#7C3AED","#06b6d4","#22c55e","#f59e0b","#ef4444","#ec4899","#8b5cf6","#14b8a6"];

export default function StatsPage() {
  const { library } = useLibrary();

  // 상태별 집계
  const totalGames = library.length;
  const completed  = library.filter((g) => g.status === 'completed').length;
  const playing    = library.filter((g) => g.status === 'playing').length;
  const backlog    = library.filter((g) => g.status === 'backlog').length;
  const dropped    = library.filter((g) => g.status === 'dropped').length;
  const cr         = totalGames > 0 ? Math.round((completed / totalGames) * 100) : 0;

  // 장르별 게임 수 집계
  const genreStats = useMemo(() => {
    const map = {};
    library.forEach((g) => {
      (g.genres || g.genre || []).forEach((genre) => {
        if (!map[genre]) map[genre] = { genre, count: 0 };
        map[genre].count++;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((g, i) => ({ ...g, color: GENRE_COLORS[i] }));
  }, [library]);

  const maxGenre = Math.max(...genreStats.map((g) => g.count), 1);

  // 최근 6개월 게임 추가 수 집계
  const monthlyData = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('ko', { month: 'short' });
      const count = library.filter((g) => g.created_at?.startsWith(key)).length;
      result.push({ month: label, count });
    }
    return result;
  }, [library]);

  const maxMonthly = Math.max(...monthlyData.map((m) => m.count), 1);

  return (
    <div>
      <TopBar
        title="Play Stats"
        subtitle={`${totalGames}개 게임 기록`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Games"     value={totalGames}          icon="library"  color="#7C3AED" />
        <StatCard label="Completion Rate" value={`${cr}%`}            icon="trophy"   color="#22c55e" sub={`${completed} of ${totalGames}`} />
        <StatCard label="Playing Now"     value={playing}             icon="gamepad"  color="#f59e0b" />
        <StatCard label="Backlog Debt"    value={backlog}             icon="bookmark" color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <GlassCard style={{ padding: "22px" }}>
          <div style={{ fontWeight: 700, fontFamily: "var(--font2)", marginBottom: 18, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="stats" size={15} style={{ color: "#a855f7" }} /> Genre Breakdown
          </div>
          {genreStats.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {genreStats.map((g) => (
                <div key={g.genre}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>{g.genre}</span>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{g.count} games</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(g.count / maxGenre) * 100}%`, background: `linear-gradient(90deg,${g.color},${g.color}88)`, borderRadius: 99, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>게임을 추가하면 장르 통계가 표시됩니다.</div>
          )}
        </GlassCard>

        <GlassCard style={{ padding: "22px" }}>
          <div style={{ fontWeight: 700, fontFamily: "var(--font2)", marginBottom: 18, fontSize: 15 }}>Monthly Added (6mo)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, paddingBottom: 24, position: "relative" }}>
            {monthlyData.map((m) => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}>
                <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, marginBottom: 4 }}>{m.count}</div>
                <div style={{ width: "100%", background: "linear-gradient(180deg,#7C3AED,#a855f7aa)", borderRadius: "6px 6px 0 0", height: `${(m.count / maxMonthly) * 130}px`, minHeight: m.count > 0 ? 4 : 0 }} />
                <div style={{ position: "absolute", bottom: 0, fontSize: 11, color: "var(--text3)" }}>{m.month}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard style={{ padding: "22px" }}>
        <div style={{ fontWeight: 700, fontFamily: "var(--font2)", marginBottom: 16, fontSize: 15 }}>Library Status</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { key: "playing",   label: "Playing",   value: playing,   color: "#22c55e", icon: "gamepad" },
            { key: "completed", label: "Completed", value: completed, color: "#7C3AED", icon: "trophy" },
            { key: "backlog",   label: "Backlog",   value: backlog,   color: "#f59e0b", icon: "bookmark" },
            { key: "dropped",   label: "Dropped",   value: dropped,   color: "#ef4444", icon: "x" },
          ].map((s) => {
            const pct = totalGames > 0 ? Math.round((s.value / totalGames) * 100) : 0;
            return (
              <div key={s.key} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <Icon name={s.icon} size={20} style={{ color: s.color, margin: "0 auto 10px" }} />
                <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
