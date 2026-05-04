export default function Avatar({ name, size = 36, style: sty }) {
  const colors = ["#7C3AED", "#a855f7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `linear-gradient(135deg,${color},${color}88)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: size * 0.35,
      fontWeight: 700,
      flexShrink: 0,
      border: "2px solid rgba(255,255,255,0.1)",
      ...sty,
    }}>
      {name ? name.slice(0, 2).toUpperCase() : "??"}
    </div>
  );
}
