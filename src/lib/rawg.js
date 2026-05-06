// src/lib/rawg.js
const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const searchGames = async (query) => {
  const response = await fetch(`${BASE_URL}/games?key=${RAWG_KEY}&search=${query}&page_size=10`);
  const data = await response.json();
  
  return data.results.map(game => ({
    id: game.id,                                      //
    title: game.name,                                 // UI의 {game.title}과 매칭[cite: 6, 7]
    cover: game.background_image,                    // UI의 {game.cover}와 매칭[cite: 6, 7]
    metacritic: game.metacritic || 0,                 //[cite: 6, 7]
    genre: game.genres.map(g => g.name),             // UI의 {game.genre}와 매칭
    year: game.released ? new Date(game.released).getFullYear() : "TBD" // 검색 모달용
  }));
};

export const getGameDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${RAWG_KEY}`);
  const data = await response.json();
  
  return {
    id: data.id,
    title: data.name,
    cover: data.background_image,
    description: data.description_raw,
    metacritic: data.metacritic,
    genre: data.genres.map(g => g.name),
    released: data.released,
    year: data.released ? new Date(data.released).getFullYear() : "TBD"
  };
};