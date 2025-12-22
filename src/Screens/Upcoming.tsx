import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ring2 } from 'ldrs';
import OptimizedImage from '../Components/OptimizedImage';
import requests from '../request';
import instance from '../axios';
import { filterComingSoonContent, sortByReleaseDate, formatReleaseDate, getReleaseStatus, ContentItem } from '../utils/contentValidator';

ring2.register();

function Upcoming() {
  const [upcomingMovies, setUpcomingMovies] = useState<ContentItem[]>([]);
  const [upcomingTV, setUpcomingTV] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const [moviesRes, tvRes] = await Promise.all([
          instance.get(requests.fetchUpcomingMovies),
          instance.get(requests.fetchUpcomingTV)
        ]);

        const validMovies = filterComingSoonContent(moviesRes.data.results);
        const validTV = filterComingSoonContent(tvRes.data.results);

        setUpcomingMovies(sortByReleaseDate(validMovies, 'asc'));
        setUpcomingTV(sortByReleaseDate(validTV, 'asc'));
      } catch (error) {
        console.error('Error fetching upcoming content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  const displayContent = activeTab === 'movies' ? upcomingMovies : upcomingTV;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <l-ring-2
          size="60"
          stroke="5"
          stroke-length="0.25"
          bg-opacity="0.1"
          speed="0.8"
          color="#f3b83ae8"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 px-4 md:px-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-['Bebas_Neue']">
            Coming Soon
          </h1>
          <p className="text-gray-400 text-lg font-['Barlow']">
            Upcoming releases you don't want to miss
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('movies')}
            className={`pb-3 px-4 text-lg font-semibold font-['Barlow'] transition-all ${
              activeTab === 'movies'
                ? 'text-[#f3b83ae8] border-b-2 border-[#f3b83ae8]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Movies ({upcomingMovies.length})
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`pb-3 px-4 text-lg font-semibold font-['Barlow'] transition-all ${
              activeTab === 'tv'
                ? 'text-[#f3b83ae8] border-b-2 border-[#f3b83ae8]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            TV Series ({upcomingTV.length})
          </button>
        </div>

        {/* Content Grid */}
        {displayContent.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl font-['Barlow']">No upcoming releases found</p>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {displayContent.map((item) => {
              const status = getReleaseStatus(item);
              const linkPath = activeTab === 'movies' ? `/movies/${item.id}` : `/tv/${item.id}`;

              return (
                <Link key={item.id} to={linkPath}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                      <OptimizedImage
                        path={item.poster_path || null}
                        alt={item.title || item.name || 'Upcoming'}
                        type="poster"
                        size="medium"
                        className="w-full h-full"
                      />

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Status badge */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            status.color === 'red'
                              ? 'bg-red-500 text-white'
                              : status.color === 'orange'
                              ? 'bg-orange-500 text-white'
                              : status.color === 'blue'
                              ? 'bg-blue-500 text-white'
                              : status.color === 'green'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Rating badge */}
                      {item.vote_average && item.vote_average > 0 && (
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-white text-xs font-semibold">
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="mt-3">
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-1 font-['Barlow']">
                        {item.title || item.name}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm font-['Barlow']">
                        {formatReleaseDate(item)}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Upcoming;
