import React, {useEffect, useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

function EpisodeCard({ episode, showTitle, showId, season }) {
  const { playEpisode } = useAudioPlayer();
  const [isFavorited, setIsFavorited] = useState(false);

  // Check once on mount 
  useEffect(() => {
    try {
    const existing = JSON.parse(localStorage.getItem('favorites')) || [];
    const found = existing.some(ep => ep.episodeId === episode.episodeId);
    setIsFavorited(found);
    } catch (e) {
      console.error('Failed to read favorites from localStorage:', e)
    }
  }, [episode.episodeId]);

  const handleFavorite = () => {
  const existing = JSON.parse(localStorage.getItem('favorites')) || [];

  // Avoid duplicates
  const isAlreadyFavorited = existing.some(ep => ep.episodeId === episode.episodeId);
  if (isAlreadyFavorited) {
    setIsFavorited(true)
    return;
  }

  const newFavorite = {
    episodeId: episode.episodeId,
    title: episode.title,
    image: episode.image,
    showTitle,
    showId,
    season,
    favouritedAt: new Date().toISOString()
    
  };

  const updated = [...existing, newFavorite];
  localStorage.setItem('favorites', JSON.stringify(updated));
  setIsFavorited(true);
};


  const handlePlay = () => {
    playEpisode({
      title: episode.title,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
  };

  return (
     <div>
      <p>{episode.title}</p>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleFavorite} disabled= {isFavorited}>
       {isFavorited ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
     </div>
    
  );
}

export default EpisodeCard;
