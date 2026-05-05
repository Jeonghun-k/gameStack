import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';
import mockData from '../data/mockData';

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "library",   label: "Library",   icon: "library" },
  { id: "profile",   label: "Profile",   icon: "profile" },
  { id: "lfg",       label: "Team-up",   icon: "lfg" },
  { id: "stats",     label: "Stats",     icon: "stats" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = mockData;

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      background: "rgba(8,9,15,0.95)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(124,58,237,0.12)",
      padding: "24px 0",
    }}>
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(124,58,237,0.1)", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg,#7C3AED,#a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Icon name="zap" size={18} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>
              GameStack
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" }}>BETA</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map((item) => {
          const active = location.pathname === `/${item.id}` ||
            (item.id === "library" && location.pathname.startsWith("/game"));
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 10,
                background: active ? "rgba(124,58,237,0.15)" : "transparent",
                color: active ? "#a855f7" : "var(--text2)",
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: "all 0.15s",
                textAlign: "left",
                border: active ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
              }}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
              {item.id === "lfg" && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 6px", fontWeight: 700 }}>
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 16px 0", borderTop: "1px solid rgba(124,58,237,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={user.displayName} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.displayName}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>Lv.{user.level}</div>
          </div>
          <Icon name="settings" size={15} style={{ color: "var(--text3)" }} />
        </div>
      </div>
    </aside>
  );
}
