// src/hooks/useGameDetail.js
import { useState, useEffect } from 'react';
import { getGameDetail } from '../lib/rawg'; // 본인이 만든 함수 불러오기

export const useGameDetail = (id) => {
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGameDetail(id); // API 서버에 상세 정보 요청
        setGame(data);
      } catch (err) {
        setError("게임 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { game, isLoading, error };
};