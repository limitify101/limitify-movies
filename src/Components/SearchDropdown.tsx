import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Movie, Tv } from '@mui/icons-material';
import OptimizedImage from './OptimizedImage';

interface SearchResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface SearchDropdownProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultClick: () => void;
  highlightedIndex: number;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ 
  results, 
  isLoading, 
  onResultClick,
  highlightedIndex 
}) => {
  // Filter out people and limit to 8 results
  const filteredResults = results
    .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800 overflow-hidden z-50 animate-fadeIn">
        <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 mb-2 animate-pulse">
              <div className="w-12 h-18 bg-zinc-800 rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredResults.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800 overflow-hidden z-50 animate-fadeIn">
        <div className="p-6 text-center text-gray-400 font-['Barlow']">
          <p>No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800 overflow-hidden z-50 animate-fadeIn">
      <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {filteredResults.map((result, index) => {
          const title = result.title || result.name || 'Unknown';
          const isMovie = result.media_type === 'movie';
          const linkPath = isMovie ? `/movies/${result.id}` : `/tv/${result.id}`;
          const isHighlighted = index === highlightedIndex;

          return (
            <Link
              key={result.id}
              to={linkPath}
              state={{ [isMovie ? 'movie' : 'serie']: result }}
              onClick={onResultClick}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                isHighlighted 
                  ? 'bg-zinc-800/80 scale-[1.02]' 
                  : 'hover:bg-zinc-800/50 hover:scale-[1.01]'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-12 h-18 flex-shrink-0 rounded-md overflow-hidden bg-zinc-800 relative">
                {result.poster_path || result.backdrop_path ? (
                  <OptimizedImage
                    path={result.poster_path || result.backdrop_path}
                    alt={title}
                    type="poster"
                    size="small"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    {isMovie ? <Movie /> : <Tv />}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-['Barlow_Condensed'] px-2 py-0.5 rounded text-xs font-bold ${
                    isMovie 
                      ? 'bg-[#f3b83ae8] text-black' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {isMovie ? 'MOVIE' : 'TV'}
                  </span>
                  {result.vote_average > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star sx={{ fontSize: 14 }} />
                      <span className="font-['Barlow'] font-semibold">
                        {result.vote_average.toFixed(1)}
                      </span>
                    </span>
                  )}
                </div>
                <h4 className="font-['Barlow'] text-white text-sm font-medium line-clamp-2 mb-1 group-hover:text-[#f3b83ae8] transition-colors">
                  {title}
                </h4>
                {(result.release_date || result.first_air_date) && (
                  <p className="text-gray-400 font-['Barlow_Condensed'] text-xs">
                    {result.release_date || result.first_air_date}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchDropdown;
