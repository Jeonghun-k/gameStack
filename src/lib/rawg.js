const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const searchGames = async (query) => {
  if (!query) return [];
  try {
    const res = await fetch(`${BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=10`);
    const data = await res.json();
    return data.results.map(game => ({
      rawg_id: game.id,
      title: game.name,
      cover: game.background_image,
      genres: game.genres.map(g => g.name),
      metacritic: game.metacritic,
      release_date: game.released,
      platforms: game.platforms?.map(p => p.platform.name) || []
    }));
  } catch (error) {
    console.error("Error fetching from RAWG:", error);
    return [];
  }
};

export const getGameDetails = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);
    const game = await res.json();
    return {
      rawg_id: game.id,
      title: game.name,
      cover: game.background_image,
      genres: game.genres.map(g => g.name),
      metacritic: game.metacritic,
      release_date: game.released,
      description: game.description_raw,
      platforms: game.platforms?.map(p => p.platform.name) || []
    };
  } catch (error) {
    console.error("Error fetching from RAWG:", error);
    return null;
  }
};
