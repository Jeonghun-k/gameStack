import GlassCard from '../components/GlassCard';
import GameCard from '../components/GameCard';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import mockData from '../data/mockData';

export default function Dashboard({ setPage, setSelectedGame }) {
  const { user, library, activity } = mockData;
  const playing = library.filter((g) => g.status === "playing");
  const recentCompleted = library.filter((g) => g.status === "completed").slice(0, 4);

  return (
    <div>
      <TopBar
        title={`반가워요, ${user.displayName} 👋`}
        subtitle={`Lv.${user.level} · ${user.stats.totalGames} games tracked`}
      />

      <GlassCard style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar name={user.displayName} size={48} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontFamily: "var(--font2)" }}>Level {user.level}</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{user.xp.toLocaleString()} / {user.xpNext.toLocaleString()} XP</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(user.xp / user.xpNext) * 100}%`, background: "linear-gradient(90deg,#7C3AED,#a855f7)", borderRadius: 99 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {user.platforms.map((p) => (
            <span key={p} style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "var(--accent3)" }}>
              {p}
            </span>
          ))}
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Games"  value={user.stats.totalGames}                    icon="library" color="#7C3AED" />
        <StatCard label="Hours Played" value={`${user.stats.totalHours.toLocaleString()}h`} icon="clock"   color="#06b6d4" />
        <StatCard label="Completed"    value={user.stats.completed}                      icon="trophy"  color="#22c55e" />
        <StatCard label="Playing Now"  value={user.stats.playing}                        icon="gamepad" color="#f59e0b" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="gamepad" size={14} style={{ color: "#22c55e" }} /> Currently Playing
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 24 }}>
            {playing.map((g) => (
              <GameCard key={g.id} game={g} onOpen={(game) => { setSelectedGame(game); setPage("gameDetail"); }} />
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="trophy" size={14} style={{ color: "#7C3AED" }} /> Recently Completed
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
            {recentCompleted.map((g) => (
              <GameCard key={g.id} game={g} onOpen={(game) => { setSelectedGame(game); setPage("gameDetail"); }} />
            ))}
          </div>
        </div>

        <GlassCard style={{ padding: "18px", alignSelf: "start" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="zap" size={13} style={{ color: "#a855f7" }} /> Recent Activity
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activity.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 10, borderBottom: i < activity.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.game}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{a.type} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPage("library")}
            style={{ width: "100%", marginTop: 14, padding: "9px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10, color: "var(--accent2)", fontSize: 13, fontWeight: 600 }}
          >
            View Full Library →
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
