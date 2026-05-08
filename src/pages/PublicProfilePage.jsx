import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { supabase } from '../lib/supabase';

const STATUS_LABEL = { playing: "Playing", completed: "Completed", backlog: "Backlog", dropped: "Dropped" };
const STATUS_COLOR = { playing: "#22c55e", completed: "#7C3AED", backlog: "#06b6d4", dropped: "#ef4444" };

export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const [{ data: profileData, error: profileError }, { data: gamesData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('games').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);

      if (profileError || !profileData) {
        setNotFound(true);
      } else {
        setProfile(profileData);
        setGames(gamesData || []);
      }
      setLoading(false);
    };

    fetchAll();
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

  const stats = {
    total: games.length,
    playing: games.filter(g => g.status === 'playing').length,
    completed: games.filter(g => g.status === 'completed').length,
    backlog: games.filter(g => g.status === 'backlog').length,
    dropped: games.filter(g => g.status === 'dropped').length,
  };

  const genreMap = {};
  games.forEach(g => {
    (g.genres || []).forEach(genre => {
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

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

      {games.length === 0 ? (
        <GlassCard style={{ padding: "28px", textAlign: "center" }}>
          <Icon name="library" size={32} style={{ color: "rgba(168,85,247,0.3)", margin: "0 auto 14px", display: "block" }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text2)", marginBottom: 6 }}>아직 게임이 없습니다</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>이 유저는 아직 라이브러리에 게임을 추가하지 않았습니다</div>
        </GlassCard>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            <StatCard label="Total Games"  value={stats.total}     icon="library" color="#7C3AED" />
            <StatCard label="Playing"      value={stats.playing}   icon="gamepad" color="#22c55e" />
            <StatCard label="Completed"    value={stats.completed} icon="trophy"  color="#a855f7" />
            <StatCard label="Backlog"      value={stats.backlog}   icon="clock"   color="#06b6d4" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 20 }}>
            <GlassCard style={{ padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="library" size={13} style={{ color: "#a855f7" }} /> 최근 게임
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(70px,1fr))", gap: 10 }}>
                {games.slice(0, 12).map(g => (
                  <div key={g.id} style={{ position: "relative" }}>
                    {g.cover ? (
                      <img
                        src={g.cover}
                        alt={g.title}
                        style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 8, display: "block" }}
                      />
                    ) : (
                      <div style={{ width: "100%", aspectRatio: "3/4", background: "rgba(124,58,237,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="gamepad" size={18} style={{ color: "rgba(168,85,247,0.4)" }} />
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 4, left: 4 }}>
                      <span style={{ background: STATUS_COLOR[g.status] + "cc", borderRadius: 4, fontSize: 9, padding: "1px 4px", fontWeight: 700, color: "#fff" }}>
                        {STATUS_LABEL[g.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {topGenres.length > 0 && (
              <GlassCard style={{ padding: "20px", alignSelf: "start" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="stats" size={13} style={{ color: "#a855f7" }} /> 선호 장르
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {topGenres.map(([genre, count]) => (
                    <div key={genre}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: "var(--text2)", fontWeight: 500 }}>{genre}</span>
                        <span style={{ color: "var(--text3)" }}>{count}개</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(count / stats.total) * 100}%`, background: "linear-gradient(90deg,#7C3AED,#a855f7)", borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </>
      )}
    </div>
  );
}
