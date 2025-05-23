import React, {useEffect, useState}from 'react';
import { Link } from 'react-router-dom';
function Favorites() {
  // State to hold the list of favorite shows
  const [favorites, setFavorites] = useState([]);

  // Load favorite shows from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      // Parse the JSON string and update state
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // If there are no favorites stored, show a message
  if (favorites.length === 0) {
    return <p>No favorites yet.</p>;
  }

  return (
     <div>
      <h1>My Favorite Podcasts</h1>
      <ul>
        {favorites.map((show) => (
          <li key={show.id}>
            {/* Link to the show's details page */}
            <Link to={`/show/${show.id}`}>
              <img src={show.image} alt={show.title} width={100} />
              <p>{show.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
