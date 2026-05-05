import Icon from './Icon';

export const STATUS_META = {
  playing:   { label: "Playing",   color: "#22c55e", bg: "rgba(34,197,94,0.12)",  icon: "gamepad" },
  completed: { label: "Completed", color: "#7C3AED", bg: "rgba(124,58,237,0.12)", icon: "trophy" },
  backlog:   { label: "Backlog",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "bookmark" },
  dropped:   { label: "Dropped",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: "x" },
};

export default function StatusBadge({ status, size = "sm" }) {
  const m = STATUS_META[status] || STATUS_META.backlog;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: size === "sm" ? "3px 8px" : "5px 12px",
      borderRadius: 99,
      background: m.bg,
      color: m.color,
      fontSize: size === "sm" ? 11 : 13,
      fontWeight: 600,
    }}>
      <Icon name={m.icon} size={size === "sm" ? 11 : 13} />
      {m.label}
    </span>
  );
}
