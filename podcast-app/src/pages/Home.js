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

  if (loading) return <div>Loading shows...</div>;

  return (
    <div>
      <h1>Podcast Shows</h1>
      <ul>
        {shows.map(show => (
          <li key={show.id} >
            <Link to={`/show/${show.id}`}>
              <img src={show.image} alt={show.title} />
              <h2>{show.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
