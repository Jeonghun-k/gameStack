import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import mockData from '../data/mockData';

export default function LFGPage() {
  const [posts, setPosts]         = useState(mockData.lfgPosts);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm]           = useState({ game: "", type: "Co-op", desc: "" });
  const [filter, setFilter]       = useState("all");

  const submit = () => {
    if (!form.game || !form.desc) return;
    setPosts((prev) => [
      { id: Date.now(), user: "nova_striker", game: form.game, type: form.type, desc: form.desc, online: true, tags: [], time: "방금" },
      ...prev,
    ]);
    setCreateOpen(false);
    setForm({ game: "", type: "Co-op", desc: "" });
  };

  return (
    <div>
      <TopBar
        title="Team-up · LFG"
        subtitle="실시간으로 같이 게임할 팀원을 찾아보세요"
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700 }}
          >
            <Icon name="plus" size={15} /> 모집 올리기
          </button>
        }
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {["all", "Co-op", "Party", "Casual", "Hunt", "Guide"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: filter === f ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", border: filter === f ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.08)", color: filter === f ? "#c084fc" : "var(--text3)", transition: "all 0.15s" }}
          >
            {f === "all" ? "전체" : f}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text3)" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          {posts.filter((p) => p.online).length} online now
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.filter((p) => filter === "all" || p.type === filter).map((p) => (
          <GlassCard key={p.id} style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Avatar name={p.user} size={42} />
                {p.online && (
                  <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid #0e0f1a", boxShadow: "0 0 6px #22c55e" }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{p.user}</span>
                  <span style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#a855f7", fontWeight: 600 }}>{p.type}</span>
                  <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: "auto" }}>{p.time}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--accent3)", marginBottom: 4 }}>🎮 {p.game}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 8 }}>{p.desc}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {p.tags.map((t) => (
                    <span key={t} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, padding: "2px 7px", fontSize: 11, color: "var(--text3)" }}>#{t}</span>
                  ))}
                  <button style={{ marginLeft: "auto", background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    참여하기
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {createOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={(e) => e.target === e.currentTarget && setCreateOpen(false)}
        >
          <GlassCard style={{ width: 480, padding: 28, border: "1px solid rgba(124,58,237,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font2)", fontWeight: 700, fontSize: 18 }}>팀원 모집하기</h3>
              <button onClick={() => setCreateOpen(false)}><Icon name="x" size={18} style={{ color: "var(--text3)" }} /></button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--text3)", marginBottom: 5, fontWeight: 600 }}>게임 이름</label>
              <input
                value={form.game}
                onChange={(e) => setForm((p) => ({ ...p, game: e.target.value }))}
                placeholder="예: Elden Ring"
                style={{ width: "100%", background: "rgba(8,9,15,0.8)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 9, padding: "9px 12px", color: "var(--text)", fontSize: 13, outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--text3)", marginBottom: 5, fontWeight: 600 }}>타입</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Co-op", "Party", "Casual", "Hunt", "Guide"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: form.type === t ? "rgba(124,58,237,0.2)" : "transparent", border: form.type === t ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.1)", color: form.type === t ? "#c084fc" : "var(--text3)" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--text3)", marginBottom: 5, fontWeight: 600 }}>모집 내용</label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                placeholder="어떤 팀원을 찾고 있나요?"
                style={{ width: "100%", background: "rgba(8,9,15,0.8)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 9, padding: "9px 12px", color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", minHeight: 80 }}
              />
            </div>
            <button
              onClick={submit}
              style={{ width: "100%", background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "11px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}
            >
              게시하기
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
