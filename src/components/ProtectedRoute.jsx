import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // 아직 세션을 확인 중이라면 아무것도 렌더링하지 않거나 로딩 스피너를 보여줄 수 있습니다.
  if (loading) return null;

  // 유저가 없다면 로그인 페이지(루트)로 돌려보냅니다.
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 유저가 있으면 자식 컴포넌트(보호된 페이지)를 렌더링합니다.
  return children;
}
