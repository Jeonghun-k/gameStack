import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { supabase } from '../lib/supabase';

export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>프로필을 불러오는 중...</div>;
  }

  if (notFound) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>존재하지 않는 유저입니다</div>
        <button
          onClick={() => navigate('/lfg')}
          style={{ fontSize: 13, color: "var(--accent2)", fontWeight: 600 }}
        >
          ← 유저 검색으로 돌아가기
        </button>
      </div>
    );
  }

  const joinedYear = profile.created_at ? new Date(profile.created_at).getFullYear() : '-';

  return (
    <div>
      <TopBar
        title="공개 프로필"
        subtitle={profile.nickname}
        actions={
          <button
            onClick={() => navigate('/lfg')}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", padding: "7px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
          >
            ← 검색으로 돌아가기
          </button>
        }
      />

      <GlassCard style={{ padding: "28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1))", borderBottom: "1px solid rgba(124,58,237,0.1)" }} />
        <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "flex-end" }}>
          <Avatar name={profile.nickname} size={80} style={{ border: "4px solid rgba(124,58,237,0.4)", boxShadow: "0 0 24px rgba(124,58,237,0.3)", marginTop: 40 }} />
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 24, letterSpacing: "-0.03em" }}>{profile.nickname}</div>
            <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="clock" size={12} />
              <span>GameStack 가입 {joinedYear}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: "28px", textAlign: "center" }}>
        <Icon name="library" size={32} style={{ color: "rgba(168,85,247,0.3)", margin: "0 auto 14px", display: "block" }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>라이브러리는 비공개입니다</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>게임 목록과 통계는 본인만 볼 수 있습니다</div>
      </GlassCard>
    </div>
  );
}
