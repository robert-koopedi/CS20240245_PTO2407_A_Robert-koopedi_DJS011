import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

function EpisodeCard({ episode }) {
  const { playEpisode } = useAudioPlayer();

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
    </div>
  );
}

export default EpisodeCard;
