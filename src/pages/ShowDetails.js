import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EpisodeCard from '../components/EpisodeCard';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import '../index.css';

function ShowDetails() {
  // Get the show ID from URL params
  const { id } = useParams();

  // State for show data, loading and error
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected season index
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

  // Audio player hook (if you want to implement play functionality in EpisodeCard)
  const { playEpisode } = useAudioPlayer();

  // Fetch show details on mount or when id changes
  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) throw new Error('Failed to fetch show data');
        const data = await response.json();
        setShow(data);
      } catch (err) {
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
    <div className="show-details" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Show title */}
      <h1 className="show-title">{show.title}</h1>

      {/* Show image - responsive fit */}
      {show.image && (
        <img
          src={show.image}
          alt={show.title}
          className="show-image"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '600px',
            borderRadius: '8px',
            marginBottom: '1rem',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      )}

      {/* Show description */}
      <p className="show-description">{show.description}</p>

      {/* Season buttons */}
      <h2 className="season-heading">Seasons</h2>
      <div className="season-buttons" style={{ marginBottom: '1rem' }}>
        {show.seasons.map((season, index) => (
          <button
            key={season.id || `season-${index}`}
            onClick={() => setSelectedSeasonIndex(index)}
            disabled={selectedSeasonIndex === index}
            className={`season-button ${selectedSeasonIndex === index ? 'active' : ''}`}
            style={{
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              cursor: selectedSeasonIndex === index ? 'default' : 'pointer',
            }}
          >
            Season {season.season}
          </button>
        ))}
      </div>

      {/* Selected season title and episode count */}
      <h3 className="season-title">{selectedSeason.title}</h3>
      <p className="episode-count">{selectedSeason.episodes.length} episodes</p>

      {/* Episode list */}
      <div className="episode-list">
        {selectedSeason.episodes.map((episode, index) => (
          <EpisodeCard
            key={episode.episodeId || episode.id || `episode-${index}`}
            episode={episode}
            showTitle={show.title}
            showId={show.id}
            season={selectedSeason.season || selectedSeasonIndex + 1}
            // pass playEpisode if needed inside EpisodeCard
          />
        ))}
      </div>
    </div>
  );
}

export default ShowDetails;
