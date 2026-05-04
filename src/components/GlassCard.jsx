import { useState } from 'react';

export default function GlassCard({ children, style, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick
          ? "linear-gradient(135deg, rgba(45,48,85,1) 0%, rgba(32,34,62,1) 100%)"
          : "linear-gradient(135deg, rgba(30,32,60,1) 0%, rgba(20,22,44,1) 100%)",
        border: `1px solid ${hov ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.2)"}`,
        borderRadius: 14,
        transition: "all 0.2s",
        cursor: onClick ? "pointer" : "default",
        boxShadow: hov
          ? "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
