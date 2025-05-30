import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';  // Your CSS file

function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app/shows')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("API response:", data);
        const sortedShows = data.sort((a, b) => a.title.localeCompare(b.title));
        setShows(sortedShows);
        setLoading(false);
      })
      .catch(err => {
         console.error('Error fetching shows:', err);
         setError('Failed to load shows.');
         setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading shows...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Podcast Shows</h1>
      <ul className="show-grid">
        {shows.map(show => (
          <li key={show.id} className="show-card">
            <Link to={`/show/${show.id}`} className="show-link">
              <img src={show.image} alt={show.title} className="show-image" />
              {/* Show podcast title */}
              <h2 className="show-title">{show.title}</h2>
              {/* Display genres if available */}
              <p className="show-genres">
                Genres: {show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'N/A'}
              </p>
              {/* Display number of seasons if available */}
              <p className="show-seasons">
                Seasons: {show.seasons ? show.seasons.length : 'N/A'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
