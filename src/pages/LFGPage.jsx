import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Avatar from '../components/Avatar';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { supabase } from '../lib/supabase';

export default function LFGPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('nickname', `%${query.trim()}%`);

    if (!error) setResults(data || []);
    setLoading(false);
  };

  return (
    <div>
      <TopBar
        title="유저 검색"
        subtitle="GameStack을 사용하는 다른 유저를 찾아보세요"
      />

      <GlassCard style={{ padding: "20px 24px", marginBottom: 24 }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Icon
              name="search"
              size={15}
              style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="닉네임으로 검색..."
              style={{ width: "100%", background: "rgba(8,9,15,0.8)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 10, padding: "10px 14px 10px 40px", color: "var(--text)", fontSize: 14, outline: "none" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#7C3AED,#a855f7)", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}
          >
            <Icon name="search" size={14} /> {loading ? '검색 중...' : '검색'}
          </button>
        </form>
      </GlassCard>

      {!searched && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
          <Icon name="search" size={36} style={{ color: "rgba(168,85,247,0.3)", margin: "0 auto 16px", display: "block" }} />
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>닉네임을 검색해보세요</div>
          <div style={{ fontSize: 13 }}>다른 유저의 프로필을 확인할 수 있습니다</div>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>검색 결과가 없습니다</div>
          <div style={{ fontSize: 13 }}>다른 닉네임으로 검색해보세요</div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {results.map((u) => (
            <GlassCard
              key={u.id}
              style={{ padding: "20px", cursor: "pointer" }}
              onClick={() => navigate(`/${u.id}`)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <Avatar name={u.nickname} size={48} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.nickname}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
                    가입 {u.created_at ? new Date(u.created_at).getFullYear() : '-'}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontSize: 12, color: "var(--accent2)", fontWeight: 600 }}>
                프로필 보기 <Icon name="chevron" size={12} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
