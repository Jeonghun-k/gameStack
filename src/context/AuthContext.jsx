// 전역 로그인 상태 관리 파일
// 앱 전체에서 현재 로그인한 유저 정보와 로그인/로그아웃 함수를 사용할 수 있게 해줌
// main.jsx에서 <AuthProvider>로 앱 전체를 감싸야 함

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Context 생성 — useAuth() 훅을 통해 어느 컴포넌트에서든 접근 가능
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // user: 현재 로그인한 유저 객체 (비로그인 시 null)
  const [user, setUser] = useState(null);
  // loading: 세션 확인 중 여부 (true일 때는 화면을 렌더링하지 않음)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 앱 시작 시 현재 세션(로그인 상태)을 Supabase에서 가져옴
    // 새로고침해도 로그인 유지되는 이유가 여기 있음
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 로그인/로그아웃 이벤트를 실시간으로 감지하여 user 상태를 자동 업데이트
    // 예: 다른 탭에서 로그아웃하면 이 탭도 자동으로 반영됨
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 정리 (메모리 누수 방지)
    return () => subscription.unsubscribe();
  }, []);

  // TODO: Discord → Google 로그인으로 교체 필요
  // 현재는 Discord OAuth 로그인 (PRD 기준은 Google OAuth)
  // 교체 방법: provider: 'discord' → provider: 'google'
  const signInWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
    });
  };

  // 이메일 + 비밀번호 로그인 (소셜 로그인 외 대안)
  const signInWithEmail = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  // 이메일 회원가입 (nickname은 Supabase user_metadata에 저장됨)
  const signUpWithEmail = async (email, password, nickname) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nickname } }
    });
  };

  // 로그아웃 — Sidebar의 로그아웃 버튼에 연결해야 함
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    // value로 내보내는 것들을 useAuth()로 어디서든 꺼내 쓸 수 있음
    // loading이 true인 동안은 children(앱 전체)을 렌더링하지 않아 깜빡임 방지
    <AuthContext.Provider value={{ user, signInWithDiscord, signInWithEmail, signUpWithEmail, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 import { useAuth } from '../context/AuthContext' 로 불러와 사용
// 예: const { user, signOut } = useAuth();
export const useAuth = () => {
  return useContext(AuthContext);
};
