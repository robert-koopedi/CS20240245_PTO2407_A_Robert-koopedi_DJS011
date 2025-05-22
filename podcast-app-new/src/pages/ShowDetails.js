import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
}
 finally {
        setLoading(false);
      }
      
    };

    fetchShow();
  }, [id]);

  if (loading) return <p>Loading show details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!show) return <p>No show data found.</p>;

  return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>

      <h2>Seasons:</h2>
      <ul>
        {show.seasons.map((season) => (
          <li key={season.id}>
            Season {season.season}: {season.title} ({season.episodes.length} episodes)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowDetails;
