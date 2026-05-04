import Icon from './Icon';

export default function TopBar({ title, subtitle, actions, searchVal, onSearch }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
      gap: 16,
    }}>
      <div>
        <h1 style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onSearch && (
          <div style={{ position: "relative" }}>
            <Icon name="search" size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
            <input
              value={searchVal}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search games…"
              style={{
                background: "rgba(20,22,42,0.8)",
                border: "1px solid rgba(124,58,237,0.15)",
                borderRadius: 10,
                padding: "7px 12px 7px 32px",
                color: "var(--text)",
                fontSize: 13,
                outline: "none",
                width: 200,
              }}
            />
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}
