import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EpisodeCard from '../components/EpisodeCard';
import { useAudioPlayer } from '../context/AudioPlayerContext';


function ShowDetails() {
   // Get the show ID from the URL parameters
  const { id } = useParams();
  
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
   // Add state for selected season
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  
   // Hook to play audio globally
  const { playEpisode } = useAudioPlayer();

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch shows list');
        const data = await response.json();
        console.log('Data:', data);
        setShow(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
      
    };

    fetchShow();
  }, [id]);

  if (loading) return <p>Loading show details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!show) return <p>No show data found.</p>;

  const selectedSeason = show.seasons[selectedSeasonIndex];

   return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>

      <h2>Seasons</h2>
      <div>
        {show.seasons.map((season, index) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeasonIndex(index)}
            disabled={selectedSeasonIndex === index}
          >
            Season {season.season}
          </button>
        ))}
      </div>

      <h3>{selectedSeason.title}</h3>
      <p>{selectedSeason.episodes.length} episodes</p>

      <div>
        {selectedSeason.episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            onPlay={() =>
              playEpisode({
                title: episode.title,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ShowDetails;
