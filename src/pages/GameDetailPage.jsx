import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameDetail } from '../hooks/useGameDetail'; // ▶ [P0] RAWG API로 게임 상세 정보 fetch 완료
import GlassCard from '../components/GlassCard';
import StatusBadge, { STATUS_META } from '../components/StatusBadge';
import StarRating from '../components/StarRating';
import Icon from '../components/Icon';

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ▶ [P0] RAWG API로 게임 상세 정보 fetch
  const { game, isLoading, error } = useGameDetail(id);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("backlog");
  const [review, setReview] = useState("");
  const [comments, setComments] = useState([]); // 댓글 목록 상태

  // ▶ [P1] 댓글 조회 (supabase.from('comments').select('*').eq('game_id', id))
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', Number(id))
        .order('created_at', { ascending: false });
      
      if (!error && data) setComments(data);
    };
    fetchComments();
  }, [id]);

  // ▶ [P0] 별점 저장 (supabase.from('ratings').upsert)

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('game_id', Number(id))
        .order('created_at', { ascending: false });
      
      if (!error && data) setComments(data);
    };
    fetchComments();
  }, [id]);
  
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; 

      const { data: ratingData } = await supabase
        .from('ratings')
        .select('score')
        .eq('user_id', user.id)
        .eq('game_id', Number(id))
        .single();
      
      if (ratingData) setRating(ratingData.score);

      const { data: gameData } = await supabase
        .from('games')
        .select('status')
        .eq('user_id', user.id)
        .eq('rawg_id', Number(id))
        .single();

      if (gameData) setStatus(gameData.status);
    };

    fetchUserPreferences();
  }, [id]);

  // ▶ [P1] 상태 변경 저장 (Supabase UPDATE)
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

  // ▶ [P1] 리뷰 저장 기능 연결 & 댓글 작성 (supabase.from('comments').insert)
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
      setComments([data, ...comments]); // UI 즉시 업데이트
      setReview(""); // 입력창 초기화
    }
  };

  // ▶ [P1] 댓글 삭제 (supabase.from('comments').delete().eq('id', commentId))
  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  if (isLoading) return <div style={{ padding: 40, color: "var(--text3)", textAlign: "center" }}>데이터를 불러오는 중...</div>;
  if (error || !game) return <div style={{ padding: 40, color: "var(--text3)", textAlign: "center" }}>게임을 찾을 수 없습니다.</div>;

  return (
    <div>
      <button
        onClick={() => navigate('/library')}
        style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text3)", fontSize: 13, marginBottom: 20 }}
      >
        <Icon name="chevronLeft" size={15} /> Back to Library
      </button>

      {/* 게임 헤더 영역 (커버, 제목, 메타스코어, 출시일 등) */}
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

      {/* 상태 변경 및 별점 폼 */}
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

      {/* 리뷰 작성 폼 */}
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

      {/* 댓글 목록 렌더링 영역 (추가된 UI) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map((c) => (
          <GlassCard key={c.id} style={{ padding: "16px" }}>
            <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, whiteSpace: "pre-wrap" }}>{c.text}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--text3)" }}>
              <span>{new Date(c.created_at).toLocaleDateString()}</span>
              <button onClick={() => handleDeleteComment(c.id)} style={{ color: "#ef4444" }}>삭제</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}