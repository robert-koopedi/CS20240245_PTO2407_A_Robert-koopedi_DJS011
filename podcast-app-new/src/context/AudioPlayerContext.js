import React, { createContext, useContext, useState, useRef } from 'react';

const AudioPlayerContext = createContext();

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}