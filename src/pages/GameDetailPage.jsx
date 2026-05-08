import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameDetail } from '../hooks/useGameDetail'; 
import GlassCard from '../components/GlassCard';
import StatusBadge, { STATUS_META } from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Icon from '../components/Icon';

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  const { game, isLoading, error } = useGameDetail(id);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("backlog");
  const [review, setReview] = useState("");
  const [comments, setComments] = useState([]);
  const [allRatings, setAllRatings] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: ratingsData } = await supabase
        .from('ratings')
        .select('user_id, score')
        .eq('game_id', Number(id));
      if (ratingsData) setAllRatings(ratingsData);

      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', Number(id))
        .order('created_at', { ascending: false });
      
      if (!error && commentsData) {
        setComments(commentsData);
        
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, nickname')
            .in('id', userIds);
            
          if (profilesData) {
            const profilesMap = {};
            profilesData.forEach(p => { profilesMap[p.id] = p.nickname; });
            setUserProfiles(profilesMap);
          }
        }
      }
    };
    fetchData();
  }, [id]);
  
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; 

      // [수정] 로그인한 유저 정보를 상태에 저장하여 UI에서 비교할 수 있게 합니다.
      setCurrentUser(user);

      const { data: ratingData } = await supabase
        .from('ratings')
        .select('score')
        .eq('user_id', user.id)
        .eq('game_id', Number(id))
        .maybeSingle(); 
      
      if (ratingData) setRating(ratingData.score);

      const { data: gameData } = await supabase
        .from('games')
        .select('status')
        .eq('user_id', user.id)
        .eq('rawg_id', Number(id))
        .maybeSingle(); 

      if (gameData) setStatus(gameData.status);
    };

    fetchUserPreferences();
  }, [id]);

  const handleRatingChange = async (newScore) => {
    setRating(newScore);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("로그인이 필요합니다.");

      const { error } = await supabase
        .from('ratings')
        .upsert({ 
          user_id: user.id, 
          game_id: Number(id), 
          score: newScore 
        }, { onConflict: 'user_id, game_id' });

      if (error) throw error;

      setAllRatings(prev => {
        const exists = prev.find(r => r.user_id === user.id);
        if (exists) return prev.map(r => r.user_id === user.id ? { ...r, score: newScore } : r);
        return [...prev, { user_id: user.id, score: newScore }];
      });
    } catch (err) {
      console.error("별점 저장 에러:", err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('games')
      .update({ status: newStatus })
      .eq('user_id', user.id)
      .eq('rawg_id', Number(id));
  };

  // ▶ 라이브러리에서 제거 기능 추가
  const handleRemoveFromLibrary = async () => {
  const confirmDelete = window.confirm("이 게임을 라이브러리에서 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("로그인이 필요합니다.");

    // [수정] 삭제 요청과 함께 에러 상세 내용을 받습니다.
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('user_id', user.id)
      .eq('rawg_id', Number(id));

    if (error) {
      // 외래 키 에러(23503)인지 확인하기 위함
      console.error("삭제 실패 상세:", error);
      if (error.code === '23503') {
        return alert("이 게임에 작성된 리뷰나 별점이 있어 지울 수 없습니다. 리뷰를 먼저 지우거나 DB 설정을 변경해야 합니다.");
      }
      throw error;
    }

    alert("라이브러리에서 제거되었습니다.");
    navigate('/library');
  } catch (err) {
    alert("삭제 실패: " + err.message);
  }
};

  const handleSaveReview = async () => {
    if (!review.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("로그인이 필요합니다.");

    const { data, error } = await supabase
      .from('comments')
      .insert({ user_id: user.id, game_id: Number(id), text: review })
      .select()
      .single();

    if (!error && data) {
      setComments([data, ...comments]); 
      setReview(""); 
      if (!userProfiles[user.id]) {
        const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();
        if (profile) setUserProfiles(prev => ({ ...prev, [user.id]: profile.nickname }));
      }
    }
  };

  // [수정] 삭제 권한 2차 검증 로직 추가
  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', currentUser.id); // DB에서도 본인 글만 지워지도록 강제

    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    } else {
      alert("삭제할 수 없습니다.");
    }
  };

  if (isLoading) return <div style={{ padding: 40, color: "var(--text3)", textAlign: "center" }}>데이터를 불러오는 중...</div>;
  if (error || !game) return <div style={{ padding: 40, color: "var(--text3)", textAlign: "center" }}>게임을 찾을 수 없습니다.</div>;

  const averageRating = allRatings?.length > 0 ? (allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length).toFixed(1) : null;
  const ratingMap = {};
  allRatings.forEach(r => { ratingMap[r.user_id] = r.score; });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={() => navigate('/library')}
          style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text3)", fontSize: 13 }}
        >
          <Icon name="chevronLeft" size={15} /> Back to Library
        </button>
        <button 
          onClick={handleRemoveFromLibrary}
          style={{ 
            background: "transparent", color: "rgba(239, 68, 68, 0.8)", 
            border: "1px solid rgba(239, 68, 68, 0.3)", padding: "6px 14px", 
            borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Icon name="x" size={12} style={{ display: "inline-block", marginRight: 4, verticalAlign: "-1px" }} />
          Remove
        </button>
      </div>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: 24, height: 260 }}>
        <img src={game.cover} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(8,9,15,0.95) 30%,rgba(8,9,15,0.4))" }} />
        <div style={{ position: "absolute", inset: 0, padding: "32px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {game.genre && game.genre.map((g) => (
              <span key={g} style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#c084fc" }}>{g}</span>
            ))}
          </div>
          <h1 style={{ fontFamily: "var(--font2)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.03em", marginBottom: 10 }}>{game.title}</h1>
          {averageRating && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "#f59e0b", fontSize: 16, fontWeight: 700 }}>
              <Icon name="star" size={16} /> {averageRating} <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500 }}>({allRatings.length}명 평가)</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <StatusBadge status={status} size="lg" />
            {game.metacritic > 0 && (
              <div style={{ background: game.metacritic >= 90 ? "#22c55e" : game.metacritic >= 75 ? "#f59e0b" : "#ef4444", color: "#000", borderRadius: 8, padding: "4px 10px", fontSize: 14, fontWeight: 800 }}>
                MC {game.metacritic}
              </div>
            )}
            {game.released && <span style={{ fontSize: 13, color: "var(--text2)" }}>📅 {game.released}</span>}
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
                onClick={() => handleStatusChange(k)}
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
            <StarRating value={rating} onChange={handleRatingChange} />
            <span style={{ fontSize: 13, color: "var(--text2)" }}>
              {rating > 0 ? ["", "Terrible", "Bad", "Okay", "Good", "Amazing"][rating] : "Rate this game"}
            </span>
          </div>
        </GlassCard>
      </div>



      <GlassCard style={{ padding: "20px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--text2)" }}>Write a Review</div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="이 게임에 대한 생각을 남겨보세요…"
          style={{ width: "100%", background: "rgba(8,9,15,0.5)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 13, outline: "none", resize: "vertical", minHeight: 90 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button 
            onClick={handleSaveReview}
            style={{ background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700 }}
          >
            저장
          </button>
        </div>
      </GlassCard>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map((c) => {
          const authorName = userProfiles[c.user_id] || "Gamer";
          const authorRating = ratingMap[c.user_id];
          return (
            <GlassCard key={c.id} style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text2)" }}>{authorName}</span>
                  {authorRating && (
                    <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#f59e0b", fontSize: 11, fontWeight: 600, background: "rgba(245, 158, 11, 0.1)", padding: "2px 6px", borderRadius: 6 }}>
                      <Icon name="star" size={10} /> {authorRating}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, whiteSpace: "pre-wrap" }}>{c.text}</div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {currentUser && currentUser.id === c.user_id && (
                  <button 
                    onClick={() => handleDeleteComment(c.id)} 
                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600 }}
                  >
                    삭제
                  </button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}