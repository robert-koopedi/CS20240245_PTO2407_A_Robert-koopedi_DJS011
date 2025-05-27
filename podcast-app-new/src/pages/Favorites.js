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

   const groupedFavourites = favorites.reduce((acc, episode) => {
    const { showTitle, season } = episode;
    if (!acc[showTitle]) acc[showTitle] = {};
    if (!acc[showTitle][season]) acc[showTitle][season] = [];
    acc[showTitle][season].push(episode);
    return acc;
  }, {});

  // If there are no favorites stored, show a message
  if (favorites.length === 0) {
    return <p>No favorites yet.</p>;
  }

  return (
     <div>
      <h1>My Favorite Podcasts</h1>

      {/* Loops throughn shows */}
      
      {Object.entries(groupedFavourites).map(([showTitle, seasons]) => (
        <div key={showTitle}>
          <h2>{showTitle}</h2>

           {/* Loop through seasons of each show */}
          {Object.entries(seasons).map(([season, episodes]) => (
            <div key={season}>
              <h3>Season {season}</h3>
              <ul>
               {episodes.map((ep) => (
                 <li key={ep.episodeId}>
                   <p><strong>{ep.title}</strong></p>
                   {/* Date episode was added. */}
                   <p>Added: {new Date(ep.favouritedAt).toLocaleString()}</p>
                   <Link to={`/show/${ep.id}`}>
                    <img src={ep.image} alt={ep.showtitle} width={100} />
                    <p>{ep.showTitle}</p>
                   </Link>
                 </li>
               ))}
             </ul>
          </div>
        ))}
      </div>
      ))}
    </div>
  );
}

export default Favorites;
