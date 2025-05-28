import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

function EpisodeCard({ episode, showTitle, showId, season }) {
  const { playEpisode } = useAudioPlayer();

  const handleFavorite = (episode) => {
  const existing = JSON.parse(localStorage.getItem('favorites')) || [];

  // Avoid duplicates
  const isAlreadyFavorited = existing.some(ep => ep.episodeId === episode.episodeId);
  if (isAlreadyFavorited) return;

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
};


  const handlePlay = () => {
    playEpisode({
      title: episode.title,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
  };

  return (
     <div>
      <button onClick={handleFavorite}>Favorites</button>
      <p>{episode.title}</p>
       <button onClick={handlePlay}>Play</button>
    </div>
    
  );
}

export default EpisodeCard;
