import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Icon from '../components/Icon';
import { STATUS_META } from '../components/StatusBadge';
import mockData from '../data/mockData';

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = mockData.library.find((g) => g.id === Number(id));

  const [rating, setRating] = useState(game?.rating || 0);
  const [status, setStatus] = useState(game?.status || "backlog");
  const [review, setReview] = useState("");

  if (!game) {
    return <div style={{ padding: 40, color: "var(--text3)" }}>게임을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/library')}
        style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text3)", fontSize: 13, marginBottom: 20 }}
      >
        <Icon name="chevronLeft" size={15} /> Back to Library
      </button>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 24, height: 260 }}>
        <img src={game.cover} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(8,9,15,0.95) 30%,rgba(8,9,15,0.4))" }} />
        <div style={{ position: "absolute", inset: 0, padding: "32px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {game.genre.map((g) => (
              <span key={g} style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#c084fc" }}>{g}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.03em", marginBottom: 10 }}>{game.title}</h1>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <StatusBadge status={status} size="lg" />
            {game.metacritic > 0 && (
              <div style={{ background: game.metacritic >= 90 ? "#22c55e" : game.metacritic >= 75 ? "#f59e0b" : "#ef4444", color: "#000", borderRadius: 8, padding: "4px 10px", fontSize: 14, fontWeight: 800 }}>
                MC {game.metacritic}
              </div>
            )}
            {game.hours > 0 && <span style={{ fontSize: 13, color: "var(--text2)" }}>⏱ {game.hours}h played</span>}
            <span style={{ fontSize: 13, color: "var(--text2)" }}>{game.platform}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <GlassCard style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 10 }}>STATUS</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setStatus(k)}
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: status === k ? v.bg : "transparent", border: `1px solid ${status === k ? v.color + "55" : "rgba(255,255,255,0.08)"}`, color: status === k ? v.color : "var(--text3)", transition: "all 0.15s" }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 10 }}>YOUR RATING</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StarRating value={rating} onChange={setRating} />
            <span style={{ fontSize: 13, color: "var(--text2)" }}>
              {rating > 0 ? ["", "Terrible", "Bad", "Okay", "Good", "Amazing"][rating] : "Rate this game"}
            </span>
          </div>
        </GlassCard>
      </div>

      <GlassCard style={{ padding: "20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--text2)" }}>Write a Review</div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="이 게임에 대한 생각을 남겨보세요…"
          style={{ width: "100%", background: "rgba(8,9,15,0.5)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", minHeight: 90 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button style={{ background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700 }}>
            저장
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
