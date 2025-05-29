import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useFavorites } from '../context/FavoritesContext';

function EpisodeCard({ episode, showTitle, showId, season }) {
  const { playEpisode } = useAudioPlayer();
   const { addFavorite, isFavorited } = useFavorites(); 

  const handleFavorite = () => {
    addFavorite({
      episodeId: episode.episodeId,
      title: episode.title,
      image: episode.image,
      showTitle,
      showId,
      season
    });
  };
 

  const handlePlay = () => {
    playEpisode({
      title: episode.title,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
  };

  const favorited = isFavorited(episode.episodeId);

  return (
     <div>
      <p>{episode.title}</p>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleFavorite} disabled={favorited}>
       {favorited ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
     </div>
    
  );
}

export default EpisodeCard;
