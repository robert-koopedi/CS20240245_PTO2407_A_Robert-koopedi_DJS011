import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const GENRE_MAP = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

function Favorites() {
  const [favoriteShowIds, setFavoriteShowIds] = useState(() => {
    const saved = localStorage.getItem('favoriteShows');
    return saved ? JSON.parse(saved) : [];
  });

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOption, setSortOption] = useState('titleAsc');

  useEffect(() => {
    fetch('https://podcast-api.netlify.app/shows')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const favShows = data.filter((show) => favoriteShowIds.includes(show.id));
        setShows(favShows);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load favorite shows.');
        setLoading(false);
      });
  }, [favoriteShowIds]);

  const removeFavorite = (id) => {
    const updated = favoriteShowIds.filter((favId) => favId !== id);
    setFavoriteShowIds(updated);
    localStorage.setItem('favoriteShows', JSON.stringify(updated));
  };

  const getUniqueGenres = () => {
    const genreSet = new Set();
    shows.forEach(show => {
      show.genres?.forEach(id => genreSet.add(id));
    });
    return Array.from(genreSet).sort((a, b) => GENRE_MAP[a].localeCompare(GENRE_MAP[b]));
  };

  const filteredAndSortedShows = useMemo(() => {
    let filtered = shows;

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(show =>
        show.genres?.includes(Number(selectedGenre))
      );
    }

    if (filterText.trim() !== '') {
      filtered = filtered.filter(show =>
        show.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    switch (sortOption) {
      case 'titleAsc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'dateDesc':
        filtered.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'dateAsc':
        filtered.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        break;
    }

    return filtered;
  }, [shows, filterText, sortOption, selectedGenre]);

  if (loading) return <div>Loading favorite shows...</div>;
  if (error) return <div>{error}</div>;
  if (favoriteShowIds.length === 0) return <p>No favorite shows yet.</p>;

  return (
    <div className="favorites-container">
      <h1>My Favorite Shows</h1>

      {/* Controls */}
      <div className="filter-controls" style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.4rem' }}
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.4rem' }}
        >
          <option value="All">All Genres</option>
          {getUniqueGenres().map(id => (
            <option key={id} value={id}>{GENRE_MAP[id]}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: '0.4rem' }}
        >
          <option value="titleAsc">Sort A–Z</option>
          <option value="titleDesc">Sort Z–A</option>
          <option value="dateDesc">Newest First</option>
          <option value="dateAsc">Oldest First</option>
        </select>
      </div>

      {/* Show List */}
      <ul className="show-grid">
        {filteredAndSortedShows.map((show) => (
          <li key={show.id} className="show-card">
            <Link to={`/show/${show.id}`} className="show-link">
              <img src={show.image} alt={show.title} className="show-image" />
              <h2>{show.title}</h2>
              <p className="show-updated">
                Last Updated: {new Date(show.updated).toLocaleDateString()}
              </p>
              <p className="show-genres">
                Genres: {show.genres?.map(id => GENRE_MAP[id]).join(', ') || 'N/A'}
              </p>
            </Link>
            <button onClick={() => removeFavorite(show.id)} className="remove-button">
              ★ Unfavorite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
