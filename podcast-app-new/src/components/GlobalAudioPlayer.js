import React from 'react';

function GlobalAudioPlayer({ audioRef, episode }) {
  if (!episode) return null;

  return (
    <div>
      <div>Now Playing: {episode.title}</div>
      <audio ref={audioRef} controls />
    </div>
  );
}

export default GlobalAudioPlayer;
