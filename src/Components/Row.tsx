import { useEffect, useState } from "react";
import axios from "../axios"; // Adjust the path according to your project structure
import { Star } from "@mui/icons-material";
import { Link } from "react-router-dom";

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

function Row(props: { title: any; fetchURL: any; isLargeRow: boolean; }) {
  const baseURL = "https://image.tmdb.org/t/p/original/";
  const RowTitle = props.title;
  const fetchURL = props.fetchURL;
  const isLargeRow = props.isLargeRow;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(fetchURL);
        const fetchedMovies: Movie[] = response.data.results;
        
        const moviesArray = fetchedMovies.filter((mv: Movie) => mv.media_type === "movie");
        const seriesArray = fetchedMovies.filter((mv: Movie) => mv.media_type === "tv");
        setMovies(moviesArray);
        setSeries(seriesArray);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchURL]);

  const generateLinkURL = (movie: Movie): string => {
    const mediaType = movie?.media_type === "movie" ? "movies" : "tv";
    const formattedTitle = (movie?.title || movie?.name)?.toLowerCase().split(" ").join("-");
    return `/${mediaType}/${formattedTitle}-${movie?.id}`;
  };

  return (
    <div className="w-full my-10 px-6">
      <h2 className="text-white font-['Bebas_Neue'] text-3xl sm:text-2xl lg:text-2xl xl:text-2xl md:text-2xl">{RowTitle}</h2>
      <div className="flex overflow-y-hidden overflow-x-scroll py-5 min-h-80" style={{ scrollbarWidth: "none" }}>
        {movies.map((movie) => (
          <Link
            to={generateLinkURL(movie)}
            state={{ movie }}
            className="mr-8 flex flex-col justify-center p-0 items-center hover:opacity-60 transition ease-in-out duration-700 hover:scale-105"
            key={movie.id}
          >
            <div key={movie.id} className={`${isLargeRow ? 'min-w-72 sm:min-w-60 lg:min-w-56 xl:min-w-56 md:min-w-56' : 'min-w-64 sm:min-w-56 lg:min-w-52 xl:min-w-56 md:min-w-56'} flex flex-col justify-between `}>
              <img
                src={`${baseURL}${isLargeRow ? movie?.poster_path : movie?.backdrop_path}`}
                className='object-cover bg-black'
                alt={movie.name}
              />
              <div className="px-2 w-full min-h-20 -my-2" style={{ background: "linear-gradient(10deg, transparent, rgba(0, 0, 0, .897))" }}>
                <span className="flex justify-between">
                    <p className="font-['Barlow_Condensed'] bg-[#f3b83ae8] px-1 rounded-lg text-black">{movie?.media_type.toUpperCase()}</p>
                  <span style={{ color: "#eccbafdd" }} className="flex font-Barlow">
                    <Star style={{ color: "#eccbafdd" }}/>
                    <p className="mx-1">
                      {Math.round(movie?.vote_average).toFixed(1)}
                    </p>
                  </span>
                </span>
                <span className="font-['Barlow'] text-sm">
                  <p className="mt-2">{movie?.title || movie?.name}</p>
                </span>
                <span style={{ color: "#eccbafdd" }} className="flex font-['Barlow_Condensed'] text-sm">
                  <p>{movie?.first_air_date || movie?.release_date}</p>
                </span>
              </div>
            </div>
          </Link>
        ))}
        {series.map((serie) => (
          <Link
            to={generateLinkURL(serie)}
            state={{ serie }}
            className="mr-8 flex flex-col justify-center p-0 items-center hover:opacity-60 transition ease-in-out duration-700 hover:scale-105"
            key={serie.id}
          >
            <div key={serie.id} className={`${isLargeRow ? 'min-w-72 sm:min-w-60 lg:min-w-56 xl:min-w-56 md:min-w-56' : 'min-w-64 sm:min-w-56 lg:min-w-56 xl:min-w-56 md:min-w-56'} flex flex-col justify-between `}>
              <img
                src={`${baseURL}${isLargeRow ? serie?.poster_path : serie?.backdrop_path}`}
                className='object-cover bg-black'
                alt={serie.name}
              />
              <div className="px-2 w-full min-h-20 -my-2" style={{ background: "linear-gradient(10deg, transparent, rgba(0, 0, 0, .897))" }}>
                <span className="flex justify-between">

                    <p className="font-['Barlow_Condensed'] bg-[#f3b83ae8] px-1 rounded-lg text-black">{serie?.media_type.toUpperCase()}</p>
                 
                  <span style={{ color: "#eccbafdd" }} className="flex font-Barlow">
                    <Star style={{ color: "#eccbafdd" }}/>
                    <p className="mx-1">
                      {Math.round(serie?.vote_average).toFixed(1)}
                    </p>
                  </span>
                </span>
                <span className="font-['Barlow'] text-sm">
                  <p className="mt-2">{serie?.title || serie?.name}</p>
                </span>
                <span style={{ color: "#eccbafdd" }} className="flex font-['Barlow_Condensed'] text-sm">
                  <p>{serie?.first_air_date || serie?.release_date}</p>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Row;

