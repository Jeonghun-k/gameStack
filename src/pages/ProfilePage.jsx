import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../hooks/useLibrary';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { user } = useAuth();
  const { library } = useLibrary();

  const displayName = user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? 'Gamer';

  const joinedYear = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : '-';

  const userId = user?.id ?? '';

  // 라이브러리 기반 통계
  const totalGames = library.length;
  const completed  = library.filter((g) => g.status === 'completed').length;
  const backlog    = library.filter((g) => g.status === 'backlog').length;
  const topGames   = library.filter((g) => g.status === 'completed').slice(0, 6);

  // 닉네임 편집 상태
  const [editing, setEditing]   = useState(false);
  const [nickname, setNickname] = useState(displayName);
  const [saving, setSaving]     = useState(false);

  // 공유하기 클립보드 복사
  const [copied, setCopied] = useState(false);
  const profileUrl = `https://game-stack-chi.vercel.app/${userId}`;

  const handleShare = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveNickname = async () => {
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user.id, nickname });
    await supabase.auth.updateUser({ data: { full_name: nickname } });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div>
      <TopBar
        title="My Profile"
        subtitle={`game-stack-chi.vercel.app/${userId.slice(0, 8)}...`}
        actions={
          <button
            onClick={() => setEditing((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
          >
            <Icon name="edit" size={14} /> Edit
          </button>
        }
      />

      <GlassCard style={{ padding: "28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1))", borderBottom: "1px solid rgba(124,58,237,0.1)" }} />
        <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "flex-end" }}>
          <Avatar name={nickname} size={80} style={{ border: "4px solid rgba(124,58,237,0.4)", boxShadow: "0 0 24px rgba(124,58,237,0.3)", marginTop: 40 }} />
          <div style={{ flex: 1, paddingBottom: 4 }}>
            {editing ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 22, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, padding: "4px 10px", color: "#fff", outline: "none" }}
                />
                <button
                  onClick={saveNickname}
                  disabled={saving}
                  style={{ background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{ color: "var(--text3)", fontSize: 13 }}
                >
                  취소
                </button>
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{nickname}</div>
            )}
            <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{user?.email}</span> · <span>가입 {joinedYear}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Games"  value={totalGames}  icon="library"  color="#7C3AED" />
        <StatCard label="Completed"    value={completed}   icon="trophy"   color="#22c55e" />
        <StatCard label="Hours Logged" value="—"           icon="clock"    color="#06b6d4" />
        <StatCard label="Backlog"      value={backlog}     icon="bookmark" color="#f59e0b" />
      </div>

      {topGames.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="star" size={14} style={{ color: "#f59e0b" }} /> Completed Games
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
            {topGames.map((g) => (
              <div key={g.id} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "2/3", position: "relative" }}>
                <img src={g.cover} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.85))" }} />
                <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontSize: 11, fontWeight: 700, color: "#fff" }}>{g.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <GlassCard style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>공개 프로필 링크</div>
          <div style={{ fontSize: 13, color: "var(--accent2)", fontFamily: "monospace" }}>game-stack-chi.vercel.app/{userId.slice(0, 8)}...</div>
        </div>
        <button
          onClick={handleShare}
          style={{ display: "flex", alignItems: "center", gap: 7, background: copied ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, transition: "background 0.2s" }}
        >
          <Icon name={copied ? "bookmark" : "externalLink"} size={14} /> {copied ? "복사됨!" : "공유하기"}
        </button>
      </GlassCard>
    </div>
  );
}
