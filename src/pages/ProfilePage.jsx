import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import mockData from '../data/mockData';

export default function ProfilePage() {
  const { user, library } = mockData;
  const topGames = library.filter((g) => g.status === "completed" && g.rating === 5).slice(0, 6);

  return (
    <div>
      <TopBar
        title="My Profile"
        subtitle="gamestack.com/nova_striker"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a855f7", padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
              <Icon name="share" size={14} /> Share
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
              <Icon name="edit" size={14} /> Edit
            </button>
          </div>
        }
      />

      <GlassCard style={{ padding: "28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1))", borderBottom: "1px solid rgba(124,58,237,0.1)" }} />
        <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "flex-end" }}>
          <Avatar name={user.displayName} size={80} sty={{ border: "4px solid rgba(124,58,237,0.4)", boxShadow: "0 0 24px rgba(124,58,237,0.3)", marginTop: 40 }} />
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{user.displayName}</div>
            <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
              <span>@{user.id}</span> · <span>{user.location}</span> · <span>가입 {user.joinedYear}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 8, lineHeight: 1.6, maxWidth: 500 }}>{user.bio}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignSelf: "flex-start", marginTop: 40 }}>
            {user.platforms.map((p) => (
              <span key={p} style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 7, padding: "4px 10px", fontSize: 12, color: "var(--accent3)" }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Games"  value={user.stats.totalGames}                       icon="library" color="#7C3AED" />
        <StatCard label="Completed"    value={user.stats.completed}                         icon="trophy"  color="#22c55e" />
        <StatCard label="Hours Logged" value={`${user.stats.totalHours.toLocaleString()}h`} icon="clock"   color="#06b6d4" />
        <StatCard label="Backlog"      value={user.stats.backlog}                            icon="bookmark" color="#f59e0b" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="star" size={14} style={{ color: "#f59e0b" }} /> Top Rated Games (★★★★★)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
          {topGames.map((g) => (
            <div key={g.id} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "2/3", position: "relative" }}>
              <img src={g.cover} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.85))" }} />
              <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontSize: 11, fontWeight: 700, color: "#fff" }}>{g.title}</div>
            </div>
          ))}
        </div>
      </div>

      <GlassCard style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>공개 프로필 링크</div>
          <div style={{ fontSize: 13, color: "var(--accent2)", fontFamily: "monospace" }}>gamestack.com/{user.id}</div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
          <Icon name="externalLink" size={14} /> 공유하기
        </button>
      </GlassCard>
    </div>
  );
}
