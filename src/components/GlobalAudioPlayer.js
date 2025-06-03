import React,{ useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

function GlobalAudioPlayer() {
  const { currentEpisode } = useAudioPlayer();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // When audio metadata loads
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration || 0);
  };

  // While playing
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Format time helper
  const formatTime = (timeInSec) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    setCurrentTime(0); // reset on new episode
  }, [currentEpisode]);

  if (!currentEpisode) return null;

  return (
    <div>
      <div>
        <div>
          <p>{currentEpisode.title}</p>
        </div>

        <div>
          <audio
            ref={audioRef}
            src={currentEpisode.audioUrl}
            controls
            autoPlay
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />

          <div></div>
          <div>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalAudioPlayer;
