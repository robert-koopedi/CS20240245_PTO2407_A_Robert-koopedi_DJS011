
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EpisodeCard from '../components/EpisodeCard';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import '../index.css';

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

  if (loading) return <p className="loading">Loading show details...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!show) return <p className="no-data">No show data found.</p>;

  const selectedSeason = show.seasons[selectedSeasonIndex];

   return (
    <div className="show-details">
      <h1 className="show-title">{show.title}</h1>
      <p className="show-description">{show.description}</p>

      <h2 className="season-heading">Seasons</h2>
      <div className="season-buttons">
        {show.seasons.map((season, index) => (
          <button
            key={season.id || `season-${index}`} // Fallback key using index
            onClick={() => setSelectedSeasonIndex(index)}
            disabled={selectedSeasonIndex === index}
            className={`season-button ${selectedSeasonIndex === index ? 'active' : ''}`}
          >
            Season {season.season}
          </button>
        ))}
      </div>

      {/*Selected season title and number of episodes */}
      <h3 className="season-title">{selectedSeason.title}</h3>
      <p className="episode-count">{selectedSeason.episodes.length} episodes</p>

      {/*Render EpisodeCard for each episode */}
      <div className="episode-list">
        {selectedSeason.episodes.map((episode, index) => (
          <EpisodeCard 
            key={episode.episodeId || episode.id || `episode-${index}`} // Safe fallback
            episode={episode}
            showTitle={show.title}                 // pass show title
            showId={show.id}                       // pass show ID
            season={selectedSeason.season || selectedSeasonIndex + 1} // pass readable season number
          />
        ))}
      </div>
    </div>
  );
}

export default ShowDetails;
