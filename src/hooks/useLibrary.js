import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useLibrary = () => {
  const { user } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = useCallback(async () => {
    if (!user) {
      setLibrary(window.GS_DATA.library);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching library:', error);
    } else {
      setLibrary((data || []).map(g => ({ ...g, genre: g.genres || [], hours: 0, rating: 0 })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const addGameToLibrary = async (game) => {
    if (library.some(g => g.rawg_id === game.rawg_id)) {
      alert("This game is already in your library!");
      return false;
    }

    const newGame = {
      id: Date.now(),
      rawg_id: game.rawg_id,
      title: game.title,
      cover: game.cover,
      genre: game.genres || [],
      genres: game.genres || [],
      metacritic: game.metacritic,
      status: 'backlog',
      hours: 0,
      rating: 0,
      platform: 'Steam'
    };

    if (!user) {
      setLibrary(prev => [newGame, ...prev]);
      return true;
    }

    const { data, error } = await supabase
      .from('games')
      .insert([newGame])
      .select()
      .single();

    if (error) {
      console.error('Error fetching library:', error);
      return false;
    }

    setLibrary(prev => [{ ...data, genre: data.genres || [], hours: 0, rating: 0 }, ...prev]);
    return true;
  };

  const updateGameStatus = async (id, status) => {
    if (!user) {
      setLibrary(prev => prev.map(g => g.id === id ? { ...g, status } : g));
      return;
    }
    const { error } = await supabase
      .from('games')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setLibrary(prev => prev.map(g => g.id === id ? { ...g, status } : g));
    }
  };

  const deleteGame = async (id) => {
    if (!user) {
      setLibrary(prev => prev.filter(g => g.id !== id));
      return;
    }
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (!error) {
      setLibrary(prev => prev.filter(g => g.id !== id));
    }
  };

  return { library, loading, addGameToLibrary, updateGameStatus, deleteGame, fetchLibrary };
};
