import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, FilterAlt } from "@mui/icons-material";
import Footer from "../Components/Footer";
import Pagination from "../Components/Pagination";
import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import FilterPopUp from "../Components/FilterPopUp";
import { bouncy } from 'ldrs'

bouncy.register()

interface MovieResult {
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

const Search: React.FC = () => {
  const location = useLocation();
  const queryTerm: string = location.state?.term || ""; // Ensure queryTerm is defined
  const [page, setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const baseURL = "https://image.tmdb.org/t/p/original/";
  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [series, setSeries] = useState<MovieResult[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const handlePagination = (newPage: number) => {
    setPage(newPage);
  };

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODk4MGQ0MjA1ZTI2OWJmMmNkOGE3YTg2MzRhODA5NyIsIm5iZiI6MTcyMDM2NzI4Mi4yODc4NjUsInN1YiI6IjY2NjMzZGQ1NDQ2ZWIxNWU2MjE4OTAxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._VxLRd2cgoNitaCmlJ80MvWxHr6xDBP8gUHrRbSDbBU'
    }
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
}, [location.pathname]);

  useEffect(() => {
    if (!queryTerm) return; // If queryTerm is empty, don't fetch data

    async function fetchData() {
      try {
        const fetchURL: string = `https://api.themoviedb.org/3/search/multi?query=${queryTerm}&include_adult=false&language=en-US&page=${page}`;
        const request = await fetch(fetchURL, options);
        const data = await request.json();
        const fetchedResults = data.results;
        const moviesArray = fetchedResults.filter((mv: MovieResult) => mv.media_type === "movie");
        const seriesArray = fetchedResults.filter((mv: MovieResult) => mv.media_type === "tv");
        setMovies(moviesArray);
        setSeries(seriesArray);
        const receivedPages = data.total_pages;
        setTotalPages(receivedPages);
        return request;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [page, queryTerm]);
  return (
    <div className="w-screen mt-20 p-0 relative m-0 h-full lg:w-screen">
      <div className="px-6 py-4 min-h-screen">
        <div className="m-0">
          <span className="flex border-l-4 border-l-[#f3b83ae8] text-2xl px-2 items-center">
            <h2 className="font-['Barlow'] opacity-60 sm:text-xl lg:text-xl xl:text-xl">{`Search results for "${queryTerm.split("-").join(" ")}"`}</h2>
            <FilterAlt style={{fontSize:"30px"}} className="cursor-pointer hover:text-[#f3b83ae8] transition duration-300 ease-in-out opacity-80" onClick={togglePopup}/>
          </span>
        </div>
        <div className="mt-2">
          <span className="object-contain flex items-center justify-center p-4 opacity-70">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePagination}
            />
          </span>
        </div>
        {movies && movies.length>0 || series && series.length>0?(
          <div className="px-6 grid grid-cols-4 h-full items-center justify-center mt-4 sm:grid-cols-1 lg:px-4 scroll-m-0 xl:px-4 xl:grid-cols-3 md:grid-cols-2">
          {movies.map((movie) => (
            <Link to={`/movies/${(movie?.title || movie?.name).toLowerCase().split(" ").join("-")}-${movie?.id}`} state={{ movie }} className="m-4 flex flex-col justify-center p-0 items-center hover:opacity-60 transition ease-in-out duration-700 hover:scale-105" key={movie.id}>
              <div key={movie.id} className="w-64 flex flex-col justify-between bg-black">
                <img src={movie?.backdrop_path ? `${baseURL}${movie?.backdrop_path || movie?.poster_path}` : `https://placehold.co/100x60/000000/FFF`}
                  className='object-cover min-h-40 bg-black'
                  alt={movie?.name} />

                <div className="px-2 w-full min-h-20 -my-2" style={{
                  background: "linear-gradient(10deg, transparent, rgba(0, 0, 0, .897))"
                }}>
                  <span className="flex justify-between">
                    <span style={{ color: "#eccbafdd" }} className="flex font-['Barlow']">
                      <Star style={{ color: "#eccbafdd" }} />
                      <p className="mx-1">
                        {Math.round(movie?.vote_average).toFixed(1)}
                      </p>
                    </span>
                  </span>
                  <span className="font-['Barlow']">
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
            <Link to={`/movies/${(serie?.title || serie?.name).toLowerCase().split(" ").join("-")}-${serie?.id}`} state={{ serie }} className="m-4 flex flex-col justify-center p-0 items-center hover:opacity-60 transition ease-in-out duration-700 hover:scale-105" key={serie.id}>
              <div key={serie.id} className="w-64 flex flex-col justify-between bg-black">
                <img src={serie?.backdrop_path ? `${baseURL}${serie?.backdrop_path || serie?.poster_path}` : `https://placehold.co/100x60/000000/FFF`}
                  className='object-cover min-h-40 bg-black'
                  alt={serie?.name} />

                <div className="px-2 w-full min-h-20 -my-2" style={{
                  background: "linear-gradient(10deg, transparent, rgba(0, 0, 0, .897))"
                }}>
                  <span className="flex justify-between">
                    <span style={{ color: "#eccbafdd" }} className="flex font-['Barlow']">
                      <Star style={{ color: "#eccbafdd" }} />
                      <p className="mx-1">
                        {Math.round(serie?.vote_average).toFixed(1)}
                      </p>
                    </span>
                  </span>
                  <span className="font-['Barlow']">
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
        ):(
          <div className="w-full flex items-center justify-center h-96">
            <l-bouncy
            size="45"
            speed="1.75"
            color="#f3b83ae8" 
            ></l-bouncy>
        </div>
        )}
        
        {showPopup && <FilterPopUp handleClose={togglePopup} search={true}/>}
      </div>
      <Footer />
    </div>
  );
}

export default Search;
