import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  // Local state to hold all favorite episodes
  const [favorites, setFavorites] = useState([]);

  // State for search input filter
  const [filterText, setFilterText] = useState('');

  // State for filtering by show title
  const [showFilter, setShowFilter] = useState('all');

  // State for sorting favorites
  const [sortBy, setSortBy] = useState('date-desc'); // default: newest first

  // Load favorites from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Remove a favorite episode from list and localStorage
  const handleRemoveFavorite = (episodeToRemove) => {
    const updatedFavorites = favorites.filter(
      (ep) =>
        !(
          ep.showId === episodeToRemove.showId &&
          ep.season === episodeToRemove.season &&
          ep.episodeId === episodeToRemove.episodeId
        )
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Apply filters (text & show), then sort the favorites list
  const filteredAndSortedFavorites = useMemo(() => {
    return [...favorites]
      .filter((fav) => {
        const matchesText = (fav?.title || '').toLowerCase().includes(filterText.toLowerCase());
        const matchesShow = showFilter === 'all' || fav.showTitle === showFilter;
        return matchesText && matchesShow;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return new Date(a.favouritedAt) - new Date(b.favouritedAt);
          case 'title-asc':
            return (a.title || '' ).localeCompare(b.title || '' );
          case 'title-desc':
            return (b.title || '' ).localeCompare(a.title || '' );
          case 'date-desc':
          default:
            return new Date(b.favouritedAt) - new Date(a.favouritedAt);
        }
      });
  }, [favorites, filterText, showFilter, sortBy]);

  // Group filtered favorites by show title > season
  const groupedFavourites = useMemo(() => {
    return filteredAndSortedFavorites.reduce((acc, episode) => {
      const { showTitle, season } = episode;
      if (!acc[showTitle]) acc[showTitle] = {};
      if (!acc[showTitle][season]) acc[showTitle][season] = [];
      acc[showTitle][season].push(episode);
      return acc;
    }, {});
  }, [filteredAndSortedFavorites]);

  // If no favorites exist at all, show a placeholder message
  if (favorites.length === 0) {
    return <p>No favorites yet.</p>;
  }

  return (
    <div>
      <h1>My Favorite Podcasts</h1>

      {/* Filter & Sort Controls */}
      <div className="filter-controls" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Search by title */}
        <input
          type="text"
          placeholder="Search episode title..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        
        <button onClick={() => {
          if (window.confirm("Clear all favorites?")) {
            localStorage.removeItem('favorites');
            setFavorites([]);
          }
        }}>Clear All Favorites</button>        

        {/* Dropdown to filter by show title */}
        <label>
          Show:
          <select value={showFilter} onChange={(e) => setShowFilter(e.target.value)}>
            <option value="all">All Shows</option>
            {[...new Set(favorites.map((f) => f.showTitle))].map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>



        {/* Dropdown to sort the favorites list */}
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Date Added (Newest)</option>
            <option value="date-asc">Date Added (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </label>
      </div>

      {/* If no results after filtering, show a message */}
      {filteredAndSortedFavorites.length === 0 ? (
        <p>No matching favorites found.</p>
      ) : (
        // Group and render episodes by show and season
        Object.entries(groupedFavourites).map(([showTitle, seasons]) => (
          <div key={showTitle}>
            <h2>{showTitle}</h2>
            {Object.entries(seasons).map(([seasonNumber, episodes]) => (
              <div key={seasonNumber}>
                <h3>Season {seasonNumber}</h3>
                <ul>
                  {episodes.map((ep) => (
                    <li key={`${ep.showId}-${ep.season}-${ep.episodeId}`}>
                      <p><strong>{ep.title}</strong></p>
                      <p>Added: {new Date(ep.favouritedAt).toLocaleString()}</p>
                      <Link to={`/show/${ep.showId}`}>
                        <img src={ep.image} alt={ep.showTitle} width={100} height={100} />
                        <p>{ep.showTitle}</p>
                      </Link>
                      <button onClick={() => handleRemoveFavorite(ep)}>
                        Remove from Favorites
                      </button>
                      
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Favorites;
