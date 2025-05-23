import React, { createContext, useContext, useState, useRef } from 'react';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';

const AudioPlayerContext = createContext();

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}

export function AudioPlayerProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const audioRef = useRef(new Audio());

  const playEpisode = (episode) => {
    setCurrentEpisode(episode);
    audioRef.current.src = episode.audioUrl;
    audioRef.current.play();
  };

  const pauseEpisode = () => {
    audioRef.current.pause();
  };

  const resumeEpisode = () => {
    audioRef.current.play();
  };

  return (
    <AudioPlayerContext.Provider value={{ currentEpisode, playEpisode, pauseEpisode, resumeEpisode }}>
      {children}
      <GlobalAudioPlayer audioRef={audioRef} episode={currentEpisode} />
    </AudioPlayerContext.Provider>
  );
}