import React, { useEffect, useState } from 'react';
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

function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('titleAsc');

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteShows');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch('https://podcast-api.netlify.app/shows')
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setShows(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load shows.');
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      localStorage.setItem('favoriteShows', JSON.stringify(updated));
      return updated;
    });
  };

  const getUniqueGenres = () => {
    const allGenres = new Set();
    shows.forEach(show => show.genres?.forEach(id => allGenres.add(id)));
    return Array.from(allGenres).sort((a, b) =>
      GENRE_MAP[a].localeCompare(GENRE_MAP[b])
    );
  };

  const filteredShows = shows
    .filter(show =>
      selectedGenre === 'All' || show.genres?.includes(Number(selectedGenre))
    )
    .filter(show =>
      show.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        case 'titleDesc':
          return b.title.localeCompare(a.title);
        case 'dateDesc':
          return new Date(b.updated) - new Date(a.updated);
        case 'dateAsc':
          return new Date(a.updated) - new Date(b.updated);
        default:
          return 0;
      }
    });

  if (loading) return <div className="loading">Loading shows...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Podcast Shows</h1>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="genreFilter" style={{ marginRight: '0.5rem' }}>
          Filter by Genre:
        </label>
        <select
          id="genreFilter"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="All">All Genres</option>
          {getUniqueGenres().map(id => (
            <option key={id} value={id}>{GENRE_MAP[id]}</option>
          ))}
        </select>

        {/* Text Search */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.4rem' }}
        />

        {/* Sort Options */}
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
        {filteredShows.map(show => {
          const isFav = favorites.includes(show.id);
          return (
            <li key={show.id} className="show-card">
              <Link to={`/show/${show.id}`} className="show-link">
                <img src={show.image} alt={show.title} className="show-image" />
                <h2 className="show-title">{show.title}</h2>
                <p className="show-genres">
                  Genres:{' '}
                  {show.genres?.map(id => GENRE_MAP[id]).join(', ') || 'N/A'}
                </p>
                <p className="show-seasons">Seasons: {show.seasons || 'N/A'}</p>
                <p className="show-updated">
                  Last Updated: {new Date(show.updated).toLocaleDateString()}
                </p>
              </Link>

              <div className="buttons-container">
                <button
                  className="favorite-button"
                  onClick={() => toggleFavorite(show.id)}
                >
                  <span className="star-icon">{isFav ? '★' : '☆'}</span>{' '}
                  {isFav ? 'Unfavorite' : 'Add to Favorites'}
                </button>

                <div className="view-show-wrapper">
                  <Link to={`/show/${show.id}`}>
                    <button className="view-show-button">View Show</button>
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
