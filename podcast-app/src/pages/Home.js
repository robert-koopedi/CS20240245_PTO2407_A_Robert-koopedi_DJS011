import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app/shows')
      .then(res => res.json())
      .then(data => {
        setShows(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching shows:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading shows...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Podcast Shows</h1>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shows.map(show => (
          <li key={show.id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <Link to={`/show/${show.id}`}>
              <img src={show.image} alt={show.title} className="w-full h-48 object-cover rounded" />
              <h2 className="mt-2 text-xl font-semibold">{show.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
