import GlassCard from './GlassCard';
import Icon from './Icon';

export default function StatCard({ label, value, sub, icon, color = "#7C3AED" }) {
  return (
    <GlassCard style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon name={icon} size={20} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font2)", letterSpacing: "-0.03em" }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{sub}</div>}
      </div>
    </GlassCard>
  );
}
