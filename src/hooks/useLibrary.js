// 게임 라이브러리 CRUD 훅
// LibraryPage에서 mockData 대신 이 훅을 사용하면 실제 Supabase DB와 연동됨
// 로그인 상태에 따라 Supabase 또는 임시 로컬 상태로 동작함

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useLibrary = () => {
  // AuthContext에서 현재 로그인한 유저 정보를 가져옴
  const { user } = useAuth();

  // library: 게임 목록 배열
  const [library, setLibrary] = useState([]);
  // loading: 데이터 불러오는 중 여부
  const [loading, setLoading] = useState(true);

  // Supabase games 테이블에서 현재 유저의 게임 목록을 가져오는 함수
  // useCallback으로 감싸서 user가 바뀔 때만 함수가 재생성됨
  const fetchLibrary = useCallback(async () => {
    if (!user) {
      // TODO: 비로그인 시 window.GS_DATA 대신 mockData로 교체 필요
      // window.GS_DATA는 davaa 브랜치 방식 — 우리 구조에서는 동작 안 함
      setLibrary(window.GS_DATA?.library || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching library:', error);
    } else {
      // DB 컬럼명(genres)을 UI에서 쓰는 형태(genre)로 변환
      // hours, rating은 DB에 없어서 기본값 0으로 채움
      setLibrary((data || []).map(g => ({ ...g, genre: g.genres || [], hours: 0, rating: 0 })));
    }
    setLoading(false);
  }, [user]);

  // user가 바뀔 때마다(로그인/로그아웃) 라이브러리를 새로 불러옴
  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  // 게임 추가 함수
  // 같은 게임(rawg_id 기준)이 이미 있으면 중복 추가 방지
  const addGameToLibrary = async (game) => {
    if (library.some(g => g.rawg_id === game.rawg_id)) {
      alert("This game is already in your library!");
      return false;
    }

    const localGame = {
      id: Date.now(),
      rawg_id: game.rawg_id,
      title: game.title,
      cover: game.cover,
      genre: game.genres || game.genre || [],
      genres: game.genres || game.genre || [],
      metacritic: game.metacritic,
      status: 'backlog',
      hours: 0,
      rating: 0,
      platform: 'Steam'
    };

    if (!user) {
      setLibrary(prev => [localGame, ...prev]);
      return true;
    }

    // Supabase INSERT — id 제외(uuid 자동 생성), user_id 포함(RLS 필수)
    const { rawg_id, title, cover, genres, metacritic, status } = localGame;
    const { data, error } = await supabase
      .from('games')
      .insert([{ user_id: user.id, rawg_id, title, cover, genres, metacritic, status }])
      .select()
      .single();

    if (error) {
      console.error('Error adding game:', error);
      alert(`게임 추가 실패: ${error.message}`);
      return false;
    }

    // DB에 저장된 데이터를 UI 형식에 맞게 변환 후 목록 앞에 추가
    setLibrary(prev => [{ ...data, genre: data.genres || [], hours: 0, rating: 0 }, ...prev]);
    return true;
  };

  // 게임 상태 변경 함수 (backlog → playing → completed → dropped)
  const updateGameStatus = async (id, status) => {
    if (!user) {
      // 비로그인 시 로컬 상태만 변경
      setLibrary(prev => prev.map(g => g.id === id ? { ...g, status } : g));
      return;
    }
    // 로그인 시 Supabase games 테이블 UPDATE
    const { error } = await supabase
      .from('games')
      .update({ status })
      .eq('id', id);

    if (!error) {
      // DB 업데이트 성공 시 로컬 상태도 동기화
      setLibrary(prev => prev.map(g => g.id === id ? { ...g, status } : g));
    }
  };

  // 게임 삭제 함수
  const deleteGame = async (id) => {
    if (!user) {
      // 비로그인 시 로컬 상태에서만 제거
      setLibrary(prev => prev.filter(g => g.id !== id));
      return;
    }
    // 로그인 시 Supabase games 테이블에서 DELETE
    // RLS 정책으로 본인 게임만 삭제 가능
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (!error) {
      // DB 삭제 성공 시 로컬 상태도 동기화
      setLibrary(prev => prev.filter(g => g.id !== id));
    }
  };

  // LibraryPage에서 구조분해할당으로 꺼내 쓰면 됨
  // 예: const { library, loading, addGameToLibrary, updateGameStatus, deleteGame } = useLibrary();
  return { library, loading, addGameToLibrary, updateGameStatus, deleteGame, fetchLibrary };
};
