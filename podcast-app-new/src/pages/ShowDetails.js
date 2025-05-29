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
            key={season.id || `season-${index}`} // Fallback key using index
            onClick={() => setSelectedSeasonIndex(index)}
            disabled={selectedSeasonIndex === index}
          >
            Season {season.season}
          </button>
        ))}
      </div>

      

      {/*Selected season title and number of episodes */}
      <h3>{selectedSeason.title}</h3>
      <p>{selectedSeason.episodes.length} episodes</p>

      {/*Render EpisodeCard for each episode */}
      <div>
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
