import React, { useState, useEffect, memo, useCallback } from "react";
import requests from "../request";
import axios from "../axios";
import { PlayCircle, Schedule} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { API_CONFIG } from "../config/api";
import { filterReleasedContent, ContentItem } from "../utils/contentValidator";
import { isLikelyAvailable } from "../utils/videoAvailability";

type MovieType = typeof initMovie;
const initMovie = {
  id: 0,
  backdrop_path: "",
  title: "",
  name: "",
  original_name: "",
  overview: "",
  vote_average: 0,
  media_type: "",
  release_date: "",
  first_air_date: "",
};

const Banner: React.FC = memo(() => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const request = await axios.get(requests.fetchTrending);
        // V2: Filter to only show released content
        const validContent = filterReleasedContent(
          request.data.results as ContentItem[],
          50
        );

        if (validContent.length > 0) {
          // Get 5 random movies for carousel
          const shuffled = [...validContent].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 5) as MovieType[];
          setMovies(selected);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [movies.length, isTransitioning]);


  const handleDotClick = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  const truncate = useCallback((string: string, n: number) => {
    return string?.length > n ? string.substring(0, n - 1) + "..." : string;
  }, []);

  // Show skeleton loader while loading
  if (isLoading || movies.length === 0) {
    return (
      <div className="bg-zinc-950 mt-20 p-0 m-0 lg:mt-16 lg:w-full xl:w-full xl:mt-16 md:w-full">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse h-[70vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] flex flex-col items-start justify-end px-6">
          <div className="mb-5 w-96 h-20 bg-zinc-700 rounded-md animate-pulse sm:w-72 sm:h-16 lg:w-80 lg:h-16" />
          <div className="mb-5 w-36 h-12 bg-zinc-700 rounded-md animate-pulse" />
          <div className="w-3/5 mb-10 min-h-24 bg-zinc-700 rounded-md animate-pulse sm:w-full lg:w-4/5" />
        </div>
        <div className="h-16 w-full bg-[#000000f0] -mt-6 blur-md"></div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const backdropUrl = `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${API_CONFIG.TMDB_IMAGE_SIZES.backdrop.large}${currentMovie?.backdrop_path}`;
  const releaseDate = currentMovie?.release_date || currentMovie?.first_air_date;
  const isAvailable = isLikelyAvailable(releaseDate);

  return (
    <div className="bg-zinc-950 mt-20 p-0 m-0 lg:mt-16 lg:w-full xl:w-full xl:mt-16 md:w-full relative">
      <header
        className="bg-transparent p-0 m-0 bg-cover bg-no-repeat bg-center lg:w-screen xl:w-screen md:w-screen h-[70vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] relative transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: `url("${backdropUrl}")`,
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        

        <div className={`h-full flex flex-col items-start justify-end px-6 relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <h1
            className="
                    font-['Bebas_Neue']
                    text-6xl 
                    mb-5 
                    font-bold 
                    text-slate-50 
                    rounded-sm p-2 
                    bg-[#eccbaf66] 
                    backdrop-blur-sm 
                    border-2 
                    border-black
                    sm:text-4xl
                    lg:text-3xl
                    xl:text-3xl
                    md:text-3xl
                    animate-fade-in"
            style={{
              color: "#000",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
          >
            {currentMovie?.title || currentMovie?.name || currentMovie?.original_name}
          </h1>
          
          <div className="mb-5 w-36 sm:scale-90 lg:scale-90">
            {isAvailable ? (
              <Link
                to={`/watch/${currentMovie?.id}`}
                state={currentMovie.media_type === "movie" ? { movieUp: currentMovie } : { serieUp: currentMovie }}
                className="bg-black rounded-md p-3 border-l-4 border-l-[#f3b83ae8] font-['Barlow_Condensed'] text-xl lg:text-lg xl:text-lg sm:text-lg md:text-lg w-full flex items-center justify-center hover:opacity-50 hover:bg-[#f3b83ae8] hover:text-black duration-200 ease-in-out hover:border-l-0 hover:border-neutral-900"
              >
                <PlayCircle />
                <span className="w-full mx-1">WATCH NOW</span>
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-700 rounded-md p-3 border-l-4 border-l-yellow-500 font-['Barlow_Condensed'] text-xl lg:text-lg xl:text-lg sm:text-lg md:text-lg w-full flex items-center justify-center cursor-not-allowed opacity-60"
              >
                <Schedule />
                <span className="w-full mx-1">COMING SOON</span>
              </button>
            )}
          </div>

          <div
            className="w-3/5 mb-10 min-h-24 rounded-md p-2 flex flex-col items-start justify-center font-['Barlow'] italic font-light shadow-sm sm:w-full lg:w-4/5"
            style={{
              background:
                "linear-gradient(1turn, transparent, rgba(0, 0, 0, .897))",
            }}
          >
            <h3 className="flex-1 text-[#ecd364] lg:text-sm sm:text-sm xl:text-sm md:text-sm">
              {truncate(currentMovie?.overview, 150)}
            </h3>
            <span className="my-2 flex-2 flex w-1/2 font-thin">
              <p>Rating: {Math.round(currentMovie?.vote_average).toFixed(1)}</p>
            </span>
          </div>

          {/* Carousel dots indicator */}
          {movies.length > 1 && (
            <div className="flex gap-2 mb-6">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-8 h-2 bg-[#f3b83ae8]'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </header>
      <div className="h-16 w-full bg-[#000000f0] -mt-6 blur-md absolute"></div>
    </div>
  );
});

Banner.displayName = "Banner";

export default Banner;
