// src/hooks/useSearch.js
import { useState, useEffect } from 'react';
import { searchGames } from '../lib/rawg'; // 방금 만든 rawg.js 임포트

export const useSearch = (query) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 검색어가 없으면 결과를 비웁니다.
    if (!query) {
      setResults([]);
      return;
    }

    // 디바운싱: 500ms(0.5초) 대기 후 API 호출
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchGames(query);
        setResults(data);
      } catch (err) {
        setError("검색 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer); // 다음 타이핑 시 이전 타이머 취소
  }, [query]);

  return { results, isLoading, error };
};