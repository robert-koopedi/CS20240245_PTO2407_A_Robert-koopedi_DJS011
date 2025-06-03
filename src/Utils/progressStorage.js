
// Save progress time (in seconds) for an episode
export const saveProgress = (episodeId, timeInSeconds) => {
  const data = JSON.parse(localStorage.getItem('episodeProgress')) || {};
  data[episodeId] = timeInSeconds;
  localStorage.setItem('episodeProgress', JSON.stringify(data));
};

// Get saved progress time (in seconds) for an episode
export const getProgress = (episodeId) => {
  const data = JSON.parse(localStorage.getItem('episodeProgress')) || {};
  return data[episodeId] || 0;
};
