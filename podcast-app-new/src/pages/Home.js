import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';


function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
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

  if (loading) return <div className="p-4">Loading shows...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold bg-red-500 mb-6">Podcast Shows</h1>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shows.map(show => (
          <li key={show.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <Link to={`/show/${show.id}`}>
              <img src={show.image} alt={show.title} className="w-20 h-48 rounded" />
              {/* Show podcast title */}
              <h2 className="mt-2 text-xl font-semibold"> {show.title}</h2>
              {/* Display genres if available */}
              <p>
                Genres: {show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'N/A'}
              </p>
              {/* Display number of seasons if available */}
              <p>
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
