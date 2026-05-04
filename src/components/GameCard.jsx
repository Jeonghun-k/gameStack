import { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function GameCard({ game, onOpen }) {
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const colors = ["#1a0a2e", "#0a1a2e", "#0a2e1a", "#2e1a0a", "#1a1a2e"];
  const fallbackBg = colors[game.id % colors.length];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen && onOpen(game)}
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        aspectRatio: "2/3",
        cursor: "pointer",
        transform: hov ? "translateY(-4px) scale(1.02)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: hov
          ? "0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.3)"
          : "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      {!imgErr ? (
        <img
          src={game.cover}
          alt={game.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImgErr(true)}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${fallbackBg}, #0f0f1a)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ fontSize: 32, opacity: 0.3 }}>🎮</div>
        </div>
      )}
      <div style={{
        position: "absolute",
        inset: 0,
        background: hov
          ? "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.9) 70%)"
          : "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,0.9) 100%)",
        transition: "background 0.2s",
      }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 10px 10px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.3 }}>
          {game.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StatusBadge status={game.status} />
          {game.rating > 0 && (
            <div style={{ color: "#f59e0b", fontSize: 11 }}>{"★".repeat(game.rating)}</div>
          )}
        </div>
      </div>
      {game.metacritic > 0 && (
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: game.metacritic >= 90 ? "#22c55e" : game.metacritic >= 75 ? "#f59e0b" : "#ef4444",
          color: "#000",
          borderRadius: 6,
          padding: "2px 6px",
          fontSize: 11,
          fontWeight: 800,
        }}>
          {game.metacritic}
        </div>
      )}
    </div>
  );
}
