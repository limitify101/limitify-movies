import { useEffect, useState, memo, useMemo } from "react";
import axios from "../axios";
import { Star, Schedule } from "@mui/icons-material";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { filterReleasedContent, ContentItem } from "../utils/contentValidator";
import { isLikelyAvailable } from "../utils/videoAvailability";

interface Movie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  media_type: string;
  vote_average: number;
  name: string;
  first_air_date: string;
  release_date: string;
}

interface RowProps {
  title: string;
  fetchURL: string;
  isLargeRow: boolean;
}

const Row = memo(({ title, fetchURL, isLargeRow }: RowProps) => {
  const RowTitle = title;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(fetchURL);
        const fetchedMovies: Movie[] = response.data.results;

        // V2: Filter out unreleased content
        const validContent = filterReleasedContent(fetchedMovies as ContentItem[], 5) as Movie[];

        const moviesArray = validContent.filter((mv: Movie) => mv.media_type === "movie");
        const seriesArray = validContent.filter((mv: Movie) => mv.media_type === "tv");
        setMovies(moviesArray);
        setSeries(seriesArray);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchURL]);

  const generateLinkURL = useMemo(() => (movie: Movie): string => {
    const mediaType = movie?.media_type === "movie" ? "movies" : "tv";
    return `/${mediaType}/${movie?.id}`;
  }, []);

  // Skeleton card component
  const SkeletonCard = () => (
    <div className={`mr-6 flex-shrink-0 ${
      isLargeRow
        ? 'w-80 h-[480px] sm:w-64 sm:h-[400px] lg:w-64 lg:h-[400px] xl:w-72 xl:h-[440px] md:w-64 md:h-[400px]'
        : 'w-80 h-[240px] sm:w-64 sm:h-[210px] lg:w-72 lg:h-[220px] xl:w-80 xl:h-[240px] md:w-72 md:h-[220px]'
    }`}>
      <div className="w-full h-full flex flex-col rounded-xl overflow-hidden bg-zinc-900 shadow-lg">
        <div className={`${isLargeRow ? 'h-3/4' : 'h-2/3'} w-full bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse`} />
        <div className="px-3 py-2 flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="h-5 w-16 bg-zinc-700 rounded animate-pulse" />
            <div className="h-5 w-12 bg-zinc-700 rounded animate-pulse" />
          </div>
          <div className="h-4 w-3/4 bg-zinc-700 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-zinc-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full my-10 px-6">
      <h2 className="text-white font-['Bebas_Neue'] text-3xl sm:text-2xl lg:text-2xl xl:text-2xl md:text-2xl">{RowTitle}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll py-5" style={{ scrollbarWidth: "none" }}>
        {isLoading ? (
          // Show skeleton loaders while loading
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </>
        ) : (
          <>
            {movies.map((movie) => (
              <Link
                to={generateLinkURL(movie)}
                state={{ movie }}
                className="mr-6 flex-shrink-0 transition ease-in-out duration-300 hover:scale-105 group"
                key={movie.id}
              >
                <div className={`${
                  isLargeRow
                    ? 'w-80 h-[480px] sm:w-64 sm:h-[400px] lg:w-64 lg:h-[400px] xl:w-72 xl:h-[440px] md:w-64 md:h-[400px]'
                    : 'w-80 h-[240px] sm:w-64 sm:h-[210px] lg:w-72 lg:h-[220px] xl:w-80 xl:h-[240px] md:w-72 md:h-[220px]'
                } flex flex-col relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-zinc-900`}>

                  {/* Availability Badge */}
                  {!isLikelyAvailable(movie.release_date) && (
                    <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-lg">
                      <Schedule fontSize="small" />
                      <span>SOON</span>
                    </div>
                  )}

                  <div className={`${isLargeRow ? 'h-3/4' : 'h-2/3'} w-full overflow-hidden`}>
                    <OptimizedImage
                      path={isLargeRow ? movie?.poster_path : movie?.backdrop_path}
                      alt={movie?.title || movie?.name || 'Movie'}
                      type={isLargeRow ? 'poster' : 'backdrop'}
                      size="medium"
                      className='w-full h-full bg-black group-hover:opacity-80 transition-opacity duration-300'
                    />
                  </div>

                  <div className="px-3 py-2 flex-1 flex flex-col bg-gradient-to-t from-black via-zinc-900 to-transparent">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-['Barlow_Condensed'] bg-[#f3b83ae8] px-2 py-0.5 rounded-md text-black text-xs font-bold">
                        {movie?.media_type.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star fontSize="small" />
                        <span className="font-['Barlow'] text-sm font-semibold">
                          {Math.round(movie?.vote_average).toFixed(1)}
                        </span>
                      </span>
                    </div>

                    <h3 className="font-['Barlow'] text-white text-sm font-medium line-clamp-2 mb-1 flex-1">
                      {movie?.title || movie?.name}
                    </h3>

                    <p className="text-gray-400 font-['Barlow_Condensed'] text-xs truncate">
                      {movie?.first_air_date || movie?.release_date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {series.map((serie) => (
              <Link
                to={generateLinkURL(serie)}
                state={{ serie }}
                className="mr-6 flex-shrink-0 transition ease-in-out duration-300 hover:scale-105 group"
                key={serie.id}
              >
                <div className={`${
                  isLargeRow
                    ? 'w-80 h-[480px] sm:w-64 sm:h-[400px] lg:w-64 lg:h-[400px] xl:w-72 xl:h-[440px] md:w-64 md:h-[400px]'
                    : 'w-80 h-[240px] sm:w-64 sm:h-[210px] lg:w-72 lg:h-[220px] xl:w-80 xl:h-[240px] md:w-72 md:h-[220px]'
                } flex flex-col relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-zinc-900`}>

                  {/* Availability Badge */}
                  {!isLikelyAvailable(serie.release_date || serie.first_air_date) && (
                    <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-lg">
                      <Schedule fontSize="small" />
                      <span>SOON</span>
                    </div>
                  )}

                  <div className={`${isLargeRow ? 'h-3/4' : 'h-2/3'} w-full overflow-hidden`}>
                    <OptimizedImage
                      path={isLargeRow ? serie?.poster_path : serie?.backdrop_path}
                      alt={serie?.title || serie?.name || 'Series'}
                      type={isLargeRow ? 'poster' : 'backdrop'}
                      size="medium"
                      className='w-full h-full bg-black group-hover:opacity-80 transition-opacity duration-300'
                    />
                  </div>

                  <div className="px-3 py-2 flex-1 flex flex-col bg-gradient-to-t from-black via-zinc-900 to-transparent">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-['Barlow_Condensed'] bg-[#f3b83ae8] px-2 py-0.5 rounded-md text-black text-xs font-bold">
                        {serie?.media_type.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star fontSize="small" />
                        <span className="font-['Barlow'] text-sm font-semibold">
                          {Math.round(serie?.vote_average).toFixed(1)}
                        </span>
                      </span>
                    </div>

                    <h3 className="font-['Barlow'] text-white text-sm font-medium line-clamp-2 mb-1 flex-1">
                      {serie?.title || serie?.name}
                    </h3>

                    <p className="text-gray-400 font-['Barlow_Condensed'] text-xs truncate">
                      {serie?.first_air_date || serie?.release_date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
});

Row.displayName = 'Row';

export default Row;

