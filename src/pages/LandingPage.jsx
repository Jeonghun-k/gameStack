import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const { signInWithGoogle } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "40px 24px",
    }}>
      <div style={{ position: "absolute", top: "-10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-5%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", maxWidth: 680, position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 99, padding: "6px 16px", marginBottom: 32, fontSize: 12, color: "#a855f7", fontWeight: 600, letterSpacing: "0.08em" }}>
          <Icon name="zap" size={12} /> GAMER'S INTEGRATED PORTFOLIO
        </div>

        <h1 style={{ fontFamily: "var(--font2)", fontSize: "clamp(48px,8vw,88px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#fff", marginBottom: 16 }}>
          Your Games.<br />
          <span style={{ background: "linear-gradient(90deg,#7C3AED,#c084fc,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            One Stack.
          </span>
        </h1>

        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--text2)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 40px" }}>
          즐긴 게임을 한 곳에 모아 관리하고, 나만의 게이머 프로필을 만들어 공유하세요.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={signInWithGoogle}
            style={{
              background: "linear-gradient(135deg,#7C3AED,#a855f7)",
              color: "#fff",
              padding: "13px 32px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              boxShadow: hov ? "0 8px 30px rgba(124,58,237,0.5)" : "0 4px 20px rgba(124,58,237,0.3)",
              transform: hov ? "translateY(-2px)" : "none",
              transition: "all 0.2s",
            }}
          >
            Google로 시작하기 →
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 860, width: "100%", marginTop: 72, position: "relative", zIndex: 1 }}>
        {[
          { icon: "library", title: "게임 라이브러리", desc: "Backlog·Playing·Completed·Dropped 상태로 체계적 관리", color: "#7C3AED" },
          { icon: "stats",   title: "플레이 통계",    desc: "장르 분포와 상태별 현황을 한눈에 시각화",               color: "#06b6d4" },
          { icon: "lfg",     title: "유저 검색",      desc: "닉네임으로 다른 게이머를 찾고 공개 프로필을 확인하세요", color: "#22c55e" },
        ].map((f) => (
          <GlassCard key={f.title} style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Icon name={f.icon} size={22} style={{ color: f.color }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, fontFamily: "var(--font2)" }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>{f.desc}</div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 48, color: "var(--text3)", fontSize: 13, position: "relative", zIndex: 1 }}>
        {[["500,000+", "RAWG Games DB"], ["4가지", "상태 관리"], ["Google", "간편 로그인"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 22, color: "var(--text)", letterSpacing: "-0.03em" }}>{v}</div>
            <div>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
