// src/lib/rawg.js
const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const searchGames = async (query) => {
  const response = await fetch(`${BASE_URL}/games?key=${RAWG_KEY}&search=${query}&page_size=10`);
  const data = await response.json();
  
  return data.results.map(game => ({
    id: game.id,
    rawg_id: game.id,
    title: game.name,
    cover: game.background_image,
    metacritic: game.metacritic || 0,
    genre: (game.genres || []).map(g => g.name),
    genres: (game.genres || []).map(g => g.name),
    year: game.released ? new Date(game.released).getFullYear() : "TBD"
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
    genre: (data.genres || []).map(g => g.name),
    released: data.released,
    year: data.released ? new Date(data.released).getFullYear() : "TBD"
  };
};