import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Supabase 클라이언트 임포트
import GlassCard from '../components/GlassCard';
import GameCard from '../components/GameCard';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // ▶ [P0] 상태 관리 (목업 데이터 대신 사용할 실제 상태들)
  const [userProfile, setUserProfile] = useState(null);
  const [library, setLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. 현재 로그인한 유저 정보 가져오기
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const [{ data: profileData }, { data: gamesData, error }] = await Promise.all([
            supabase.from('profiles').select('nickname').eq('id', authUser.id).single(),
            supabase.from('games').select('*').eq('user_id', authUser.id),
          ]);

          const displayName =
            profileData?.nickname ??
            authUser.user_metadata?.full_name ??
            authUser.user_metadata?.name ??
            authUser.email?.split('@')[0] ??
            'Gamer';

          if (!error && gamesData) {
            setLibrary(gamesData);

            const xpPerStatus = { backlog: 10, playing: 30, completed: 60, dropped: 10 };
            const totalXp = gamesData.reduce((sum, g) => sum + (xpPerStatus[g.status] ?? 10), 0);
            const level = Math.floor(totalXp / 100) + 1;
            const xpInLevel = totalXp % 100;

            setUserProfile({
              displayName,
              level,
              xp: xpInLevel,
              xpNext: 100,
            });
          } else {
            setUserProfile({ displayName, level: 1, xp: 0, xpNext: 100 });
          }
        }
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ▶ [P1] 라이브러리 데이터를 기반으로 통계 자동 계산
  const stats = {
    totalGames: library.length,
    completed: library.filter(g => g.status === 'completed').length,
    playing: library.filter(g => g.status === 'playing').length,
    totalHours: 0 // 시간 데이터는 아직 없으므로 0으로 표시
  };

  const playingGames = library.filter((g) => g.status === "playing");
  const recentCompleted = library.filter((g) => g.status === "completed").slice(0, 4);

  if (isLoading) return <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>대시보드 데이터를 구성 중...</div>;
  if (!userProfile) return <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>로그인이 필요한 서비스입니다.</div>;

  return (
    <div>
      <TopBar
        title={`반가워요, ${userProfile.displayName} 👋`}
        subtitle={`${stats.totalGames} 개의 게임을 관리 중입니다.`}
      />

      {/* 레벨 및 경험치 카드 */}
      <GlassCard style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar name={userProfile.displayName} size={48} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontFamily: "var(--font2)" }}>Level {userProfile.level}</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{userProfile.xp.toLocaleString()} / {userProfile.xpNext.toLocaleString()} XP</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(userProfile.xp / userProfile.xpNext) * 100}%`, background: "linear-gradient(90deg,#7C3AED,#a855f7)", borderRadius: 99 }} />
          </div>
        </div>
      </GlassCard>

      {/* 통계 그리드 (실제 데이터 반영) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Games"  value={stats.totalGames} icon="library" color="#7C3AED" />
        <StatCard label="Hours Played" value={`${stats.totalHours}h`} icon="clock" color="#06b6d4" />
        <StatCard label="Completed"    value={stats.completed} icon="trophy" color="#22c55e" />
        <StatCard label="Playing Now"  value={stats.playing} icon="gamepad" color="#f59e0b" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div>
          {/* Currently Playing 섹션 */}
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="gamepad" size={14} style={{ color: "#22c55e" }} /> Currently Playing
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 24 }}>
            {playingGames.length > 0 ? (
              playingGames.map((g) => (
                <GameCard key={g.id} game={g} onOpen={(game) => navigate(`/game/${game.rawg_id}`)} />
              ))
            ) : (
              <div style={{ fontSize: 12, color: "var(--text3)", padding: 10 }}>현재 플레이 중인 게임이 없습니다.</div>
            )}
          </div>

          {/* Recently Completed 섹션 */}
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="trophy" size={14} style={{ color: "#7C3AED" }} /> Recently Completed
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
            {recentCompleted.length > 0 ? (
              recentCompleted.map((g) => (
                <GameCard key={g.id} game={g} onOpen={(game) => navigate(`/game/${game.rawg_id}`)} />
              ))
            ) : (
              <div style={{ fontSize: 12, color: "var(--text3)", padding: 10 }}>최근 완료한 게임이 없습니다.</div>
            )}
          </div>
        </div>

        {/* Recent Activity (활동 이력) */}
        <GlassCard style={{ padding: "18px", alignSelf: "start" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="zap" size={13} style={{ color: "#a855f7" }} /> Recent Activity
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {library.slice(0, 5).map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 10, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>🎮</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{g.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{g.status} · 라이브러리에 추가됨</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/library')}
            style={{ width: "100%", marginTop: 14, padding: "9px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10, color: "var(--accent2)", fontSize: 13, fontWeight: 600 }}
          >
            View Full Library →
          </button>
        </GlassCard>
      </div>
    </div>
  );
}