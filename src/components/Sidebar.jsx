import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';
import { useAuth } from '../context/AuthContext';

const nav = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "library",   label: "Library",   icon: "library" },
  { id: "profile",   label: "Profile",   icon: "profile" },
  { id: "lfg",       label: "User Search", icon: "lfg" },
  { id: "stats",     label: "Stats",     icon: "stats" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const displayName = user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? 'Gamer';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
        <div onClick={() => navigate('/')} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
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
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 16px 0", borderTop: "1px solid rgba(124,58,237,0.1)", position: "relative" }}>
        {showMenu && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 12,
            right: 12,
            background: "rgba(18,19,28,0.98)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            <button
              onClick={handleSignOut}
              style={{
                width: "100%",
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#ef4444",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              <Icon name="logout" size={15} style={{ color: "#ef4444" }} />
              로그아웃
            </button>
          </div>
        )}
        <button
          onClick={() => setShowMenu((v) => !v)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}
        >
          <Avatar name={displayName} size={34} />
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>
              {displayName}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{user?.email}</div>
          </div>
          <Icon name="chevron" size={13} style={{ color: "var(--text3)", transform: showMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </button>
      </div>
    </aside>
  );
}
