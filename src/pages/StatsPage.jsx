import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import mockData from '../data/mockData';

export default function StatsPage() {
  const { genreStats, monthlyHours, user } = mockData;
  const maxH = Math.max(...genreStats.map((g) => g.hours));
  const maxM = Math.max(...monthlyHours.map((m) => m.hours));
  const cr = Math.round((user.stats.completed / user.stats.totalGames) * 100);

  return (
    <div>
      <TopBar
        title="Play Stats"
        subtitle={`${user.stats.totalGames}개 게임 · ${user.stats.totalHours.toLocaleString()}시간 기록`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Hours"      value={`${user.stats.totalHours.toLocaleString()}h`} icon="clock"    color="#7C3AED" />
        <StatCard label="Completion Rate"  value={`${cr}%`}                                      icon="trophy"   color="#22c55e" sub={`${user.stats.completed} of ${user.stats.totalGames}`} />
        <StatCard label="Avg per Game"     value={`${Math.round(user.stats.totalHours / user.stats.totalGames)}h`} icon="fire" color="#f59e0b" />
        <StatCard label="Backlog Debt"     value={user.stats.backlog}                             icon="bookmark" color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <GlassCard style={{ padding: "22px" }}>
          <div style={{ fontWeight: 700, fontFamily: "var(--font2)", marginBottom: 18, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="stats" size={15} style={{ color: "#a855f7" }} /> Genre Breakdown
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {genreStats.map((g) => (
              <div key={g.genre}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>{g.genre}</span>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>{g.hours}h · {g.count} games</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(g.hours / maxH) * 100}%`, background: `linear-gradient(90deg,${g.color},${g.color}88)`, borderRadius: 99, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard style={{ padding: "22px" }}>
          <div style={{ fontWeight: 700, fontFamily: "var(--font2)", marginBottom: 18, fontSize: 15 }}>Monthly Hours (6mo)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, paddingBottom: 24, position: "relative" }}>
            {monthlyHours.map((m) => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}>
                <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, marginBottom: 4 }}>{m.hours}</div>
                <div style={{ width: "100%", background: "linear-gradient(180deg,#7C3AED,#a855f7aa)", borderRadius: "6px 6px 0 0", height: `${(m.hours / maxM) * 130}px`, minHeight: 4 }} />
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
            { key: "playing",   label: "Playing",   value: user.stats.playing,   color: "#22c55e", icon: "gamepad" },
            { key: "completed", label: "Completed", value: user.stats.completed, color: "#7C3AED", icon: "trophy" },
            { key: "backlog",   label: "Backlog",   value: user.stats.backlog,   color: "#f59e0b", icon: "bookmark" },
            { key: "dropped",   label: "Dropped",   value: user.stats.dropped,   color: "#ef4444", icon: "x" },
          ].map((s) => {
            const pct = Math.round((s.value / user.stats.totalGames) * 100);
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
