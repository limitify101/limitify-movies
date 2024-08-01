import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Videocam, PlayCircle, ListOutlined} from "@mui/icons-material";
import { genreIds } from "../genreIds";
import Footer from "../Components/Footer";
import YoutubeTrailer from "../Components/YoutubeTrailer";
import { Link } from "react-router-dom";
import EpisodeComponent from "../Components/Episode";
import { useLayoutEffect } from "react";
interface Cast {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

type Content = typeof initContent;

const initContent = {
  id: 0,
  title: "",
  poster_path: "",
  media_type: "",
  backdrop_path: "",
  name: "",
  original_title: "",
  vote_average: 0,
  overview: "",
  release_date: "",
  original_language: "",
  genre_ids: [],
};
type Season = typeof initSeason;

const initSeason = {
  id:0,
  season_number:0,
}
type Episode = typeof initEpisode;

const initEpisode = {
  id:0,
  still_path:"",
  title:"",
  name:"",
  episode_number:0,
}
const Overview = () => {
  const location = useLocation();
  const [movieUp, setMovieUp] = useState<Content>(initContent);
  const [serieUp, setSerieUp] = useState<Content>(initContent);
  const [vidKey, setVidKey] = useState<[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [movieCast, setMovieCast] = useState<Cast[]>([]);
  const [tvCast, setTvCast] = useState<Cast[]>([]);
  const [seasons,setSeasons] = useState<[]>([]);
  const [episodes,setEpisodes] = useState<[]>([]);
  const [seasonSelected,setSeasonAir] = useState<number|null>(null);
  const [episodeSelected,setEpisodeAir] = useState<number|null>(null);
  const baseURL = "https://image.tmdb.org/t/p/original";
    
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const fetchVideoTrailer = async (id: number, mediaType: string) => {
    try {
      let url = `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`;
      const response = await fetch(url, options);
      const data = await response.json();
      const videoKeys = data.results.map((result: any) => result.key);
      
      if (videoKeys.length > 0) {
        setVidKey(videoKeys);
      } else {
        console.log("No video trailers found.");
        // Optionally handle no trailers found case here
      }
    } catch (error) {
      console.log("Error fetching video data:", error);
      setVidKey([]);
    }
  };
  const fetchSeasons = async (id:number) =>{
    try{
      const fetchURL: string = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
      const request = await fetch(fetchURL,options);
      const data = await request.json();
      const fetchedSeasons = data.seasons;
      setSeasons(fetchedSeasons);
      
    }
    catch (error) {
      console.log("Error fetching seasons:",error);
      setSeasons([]);
    }
  };
  const fetchEpisodes = async(id:number,seasonNumber:number) => {
    try{
      const fetchURL: string = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US`;
      const request = await fetch(fetchURL,options);
      const data = await request.json();
      const fetchedEpisodes = data.episodes;
      setEpisodes(fetchedEpisodes);
      
    } 
    catch (error) {
      console.log('Error fetching episodes:',error);
      setEpisodes([]);
    }
  }
  function handleEpisode(episodeNumber:number){
    setEpisodeAir(episodeNumber);
  }
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
}, [location.pathname]);

  useEffect(() => {
    const fetchMovieAndCast = async () => {
      if (location.state?.movie) {
        const movie = location.state?.movie as Content;
        
        setMovieUp(movie);
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/${movie?.media_type||"movie"}/${movie.id}/credits?language=en-US`,
            options
          );
          const data = await response.json();
          const casts = data.cast;
          setMovieCast(casts);
  
          // Call fetchVideoTrailer after setting movieUp state
          fetchVideoTrailer(movie.id, movie.media_type||"movie");
        } catch (error) {
          console.log("Error fetching movie data:", error);
          setMovieCast([]);
        }
      }
  
      if (location.state?.serie) {
        const serie = location.state?.serie as Content;
        
        setSerieUp(serie);
        
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${serie.id}/credits?language=en-US`,
            options
          );
          const data = await response.json();
          const casts = data.cast;
          setTvCast(casts);
  
          // Call fetchVideoTrailer after setting serieUp state
          fetchVideoTrailer(serie.id, serie.media_type||"tv");
          fetchSeasons(serie.id);
          fetchEpisodes(serie.id,1);
        } catch (error) {
          console.log("Error fetching serie data:", error);
          setTvCast([]);
        }
      }
    };
  
    // Fetch movie and cast information
    fetchMovieAndCast();
  }, [location.state?.movie, location.state?.serie]);
  

  function filterGenres(ids: number[]): string[] {
    const movieGenres = genreIds.Ids[0];
    const filteredGenres = ids
      .map((id) => movieGenres[id])
      .filter((genre) => genre !== undefined);
    return filteredGenres;
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODk4MGQ0MjA1ZTI2OWJmMmNkOGE3YTg2MzRhODA5NyIsIm5iZiI6MTcxOTA2NjE5NS42Mjc4NzcsInN1YiI6IjY2NjMzZGQ1NDQ2ZWIxNWU2MjE4OTAxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YqpJSaf17UoDEDY-y5rSr7QDwHIBdcb9pZgiBVbq54c",
    },
  };

  return (
    <div className="w-screen mt-20 p-0 relative m-0 h-full">
      <div className="w-screen flex flex-col items-center min-h-screen">
        {movieUp.id !== 0 && (
          <>
            <div
              className="w-screen h-screen overflow-hidden absolute p-0 blur-sm"
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(${baseURL}${movieUp.backdrop_path})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="flex flex-col w-screen items-center justify-center h-screen py-4">
              <div
                className="flex w-4/5 rounded-lg bg-[#0000005b] h-auto mb-5 mt-5 sm:flex-col sm:w-full sm:h-5/6 py-0 lg:h-5/6 items-center justify-center"
                style={{
                  backdropFilter: "blur(5px)",
                }}
              >
                <div className="flex justify-center items-center w-2/5 sm:w-full">
                  <img
                    src={`${baseURL}${movieUp.poster_path}`}
                    alt="Movie Poster"
                    className="h-2/3 rounded-sm w-1/2 sm:w-36 sm:h-52 lg:w-44 lg:h-52 xl:w-48"
                  />
                </div>
                <div className="flex flex-col w-3/5 justify-center sm:w-full sm:items-center xl:scale-90 h-full">
                  <div
                    className="font-['Arvo'] text-2xl bg-clip-text mt-10"
                    style={{
                      background:
                        "linear-gradient(180deg, #fcd4af, rgba(255, 252, 247, .534))",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    <h3>
                      {(movieUp.title || movieUp.name || movieUp.original_title)
                        .toUpperCase()}
                    </h3>
                  </div>
                  <div className="font-['Barlow'] text-sm font-light">
                    <span className="flex">
                      <div className="mr-8">UNK</div>
                      <button
                        className="flex cursor-pointer mr-8 hover:text-[#f3b632f4] duration-200 "
                        onClick={togglePopup}
                      >
                        <Videocam />
                        <p>Trailer</p>
                      </button>
                      <div className="mr-8">
                        IMDB:{Math.round(movieUp.vote_average).toFixed(1)}
                      </div>
                    </span>
                    <span></span>
                  </div>
                  <Link to={`/watch/${(movieUp?.title || movieUp?.name).toLowerCase().split(" ").join("-")}-${movieUp?.id}`} state={{movieUp}}>
                  <button className="sm:w-full bg-black rounded-md p-3 border-l-4 border-l-[#f3b83ae8] mt-4 font-['Barlow_Condensed'] flex items-center justify-center hover:opacity-50 hover:bg-[#f3b83ae8] hover:text-black duration-200 ease-in-out hover:border-l-0 hover:border-neutral-900 w-2/6">
                        <PlayCircle />
                        <span className="w-full">WATCH NOW</span>
                  </button>
                  </Link>
                  <div className="w-full p-2 font-['Barlow'] font-light">
                    <h4>Overview:</h4>
                    <p className="font-['Barlow'] italic font-light h-fit text-sm">
                      {movieUp.overview||"NaN"}
                    </p>
                    <span className="flex justify-between w-1/2 my-1 sm:w-3/4 xl:w-3/4 md:w-3/4">
                      <div className="flex">
                        <h4>Released:</h4>
                        <p>{movieUp.release_date||"NaN"}</p>
                      </div>
                      <div className="flex">
                        <h4>Language:</h4>
                        <p>{movieUp.original_language}</p>
                      </div>
                    </span>
                    <span className="flex my-1">
                      <h4>Genre:</h4>
                      <p>{filterGenres(movieUp.genre_ids).join(",")||"NaN"}</p>
                    </span>
                    <span className="flex flex-col">
                      <h4>Casts:</h4>
                      {movieCast && movieCast.length > 0 ? (
                        <div
                          className="flex overflow-y-hidden overflow-x-scroll w-full p-0 items-center"
                          style={{
                            scrollbarWidth: "none",
                          }}
                        >
                          {movieCast.map((cast) => (
                            <div
                              className="flex flex-col justify-center p-0 items-center object-contain my-2"
                              key={cast.id}
                            >
                              <div
                                key={cast.id}
                                className="flex flex-col justify-between w-32 object-contain h-48"
                              >
                                <img
                                  src={
                                    cast.profile_path
                                      ? `${baseURL}${cast.profile_path}`
                                      : `https://placehold.co/65x100/000000/FFF`
                                  }
                                  alt={`${cast.name}`}
                                  className="rounded-md sm:w-20 sm:h-48 w-20 h-48"
                                />
                                <span className="mb-10">
                                  <p className="font-light text-sm">
                                    {cast.name}
                                  </p>
                                  <p className="opacity-60 font-extralight text-xs">
                                    {cast.character}
                                  </p>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Loading ...</p>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {showPopup && vidKey.length > 0 && <YoutubeTrailer handleClose={togglePopup} vidId={vidKey[Math.floor(Math.random() * (vidKey.length-1 + 1)) + 0]} />}
          </>
        )}
        {serieUp.id !== 0 && (
          <>
            <div
              className="w-screen overflow-hidden absolute m-0 p-0 blur opacity-70 min-h-screen"
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(${baseURL}${serieUp.backdrop_path})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="flex flex-col w-screen items-center justify-center h-screen py-4 sm:h-full lg:h-full xl:h-full">
              <div
                className="flex w-4/5 rounded-lg bg-[#0000005b] h-3/4 mb-10 mt-10 sm:flex-col sm:w-full sm:h-5/6 py-2 realtive"
                style={{
                  backdropFilter: "blur(5px)",
                }}
              >
                <div className="flex justify-center items-center w-2/5 sm:w-full">
                  <img
                    src={`${baseURL}${serieUp.poster_path}`}
                    alt="Serie Poster"
                    className="h-2/3 rounded-sm w-1/2 sm:w-36 sm:h-52 lg:w-44 lg:h-52 xl:w-48 xl:h-64"
                  />
                </div>
                <div className="flex flex-col w-3/5 justify-center sm:w-full sm:items-center">
                  <div
                    className="font-['Arvo'] text-2xl bg-clip-text mt-10"
                    style={{
                      background:
                        "linear-gradient(180deg, #fcd4af, rgba(255, 252, 247, .534))",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    <h3>
                      {(serieUp.title || serieUp.name || serieUp.original_title)
                        .toUpperCase()}
                    </h3>
                  </div>
                  <div className="font-['Barlow'] text-sm font-light">
                    <span className="flex items-center">
                      <div className="mr-8">UNK</div>
                      <button
                        className="flex cursor-pointer mr-8 hover:text-[#f3b632f4] duration-200 items-center justify-center"
                        onClick={togglePopup}
                      >
                        <Videocam fontSize="small"/>
                        <p>Trailer</p>
                      </button>
                      <div className="mr-8">
                        IMDB:{Math.round(serieUp.vote_average).toFixed(1)}
                      </div>
                    </span>
                    <span></span>
                  </div>
                  <Link to={`/watch/${(serieUp?.title || serieUp?.name).toLowerCase().split(" ").join("-")}-${serieUp?.id}`} state={{serieUp}}>
                    <button className="sm:w-full bg-black rounded-md p-3 border-l-4 border-l-[#f3b83ae8] mt-4 font-['Barlow_Condensed'] flex items-center justify-center hover:opacity-50 hover:bg-[#f3b83ae8] hover:text-black duration-200 ease-in-out hover:border-l-0 hover:border-neutral-900 w-32">
                      <PlayCircle />
                      <span className="w-full">WATCH NOW</span>
                    </button>
                  </Link>
                  <div className="w-full p-2 font-['Barlow'] font-light sm:px-4">
                    <h4>Overview:</h4>
                    <p className="font-['Barlow'] italic font-light h-fit text-sm">
                      {serieUp.overview||"NaN"}
                    </p>
                    <span className="flex justify-between w-1/2 my-1 sm:w-3/4">
                      <div className="flex">
                        <h4>Released:</h4>
                        <p>{serieUp.release_date || "NaN"}</p>
                      </div>
                      <div className="flex">
                        <h4>Language:</h4>
                        <p>{serieUp.original_language}</p>
                      </div>
                    </span>
                    <span className="flex my-1 w-full">
                      <h4>Genre:</h4>
                      <p>{filterGenres(serieUp.genre_ids).join(",")||"NaN"}</p>
                    </span>
                    <span className="flex flex-col">
                      <h4>Casts:</h4>
                      {tvCast && tvCast.length > 0 ? (
                        <div
                          className="flex overflow-y-hidden overflow-x-scroll w-full p-0 items-center"
                          style={{
                            scrollbarWidth: "none",
                          }}
                        >
                          {tvCast.map((cast) => (
                            <div
                              className="flex flex-col justify-center p-0 items-center object-contain my-2"
                              key={cast.id}
                            >
                              <div
                                key={cast.id}
                                className="flex flex-col justify-between w-32 object-contain h-48"
                              >
                                <img
                                  src={
                                    cast.profile_path
                                      ? `${baseURL}${cast.profile_path}`
                                      : `https://placehold.co/65x100/000000/FFF`
                                  }
                                  alt={`${cast.name}`}
                                  className="rounded-md sm:w-20 sm:h-32 w-20 h-32"
                                />
                                <span>
                                  <p className="font-light text-sm">
                                    {cast.name}
                                  </p>
                                  <p className="opacity-60 font-extralight text-xs">
                                    {cast.character}
                                  </p>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Loading ...</p>
                      )}
                    </span>
                  </div>
                </div>
                </div>
                <div className="w-full px-6 relative">
                  <div className="object-contain text-white flex rounded-md w-32 p-2 border justify-between font-light font-['Barlow'] cursor-pointer bg-black">
                    <ListOutlined/>
                    <select 
                      name="Seasons" 
                      id="Seasons" 
                      className="bg-transparent outline-none w-24 cursor-pointer text-white"
                      onChange={(e)=>{
                        const sn = parseInt(e.target.value.split(" ")[1],10);
                        fetchEpisodes(serieUp.id,sn);
                        setSeasonAir(sn);
                        setEpisodeAir(1);
                      }}
                    >
                      {seasons.map((season:Season)=>(
                        season.season_number !== 0?
                        (
                        <option value={`Season ${season.season_number}`} key={season.id} className="bg-black">{`Season ${season.season_number}`}</option>
                        ):null
                      ))}
                    </select>
                  </div>
                  <div className="flex overflow-y-hidden overflow-x-scroll py-5" style={{ scrollbarWidth: "none" }}>
                  {episodes.map((episode:Episode) => (
                     <div key={episode.id}>
                       <Link to={`/watch/${(serieUp?.title || serieUp?.name).toLowerCase().split(" ").join("-")}-${serieUp?.id}`} state={{serieUp,seasonSelected,episodeSelected}}
                          onMouseEnter={()=>{
                            handleEpisode(episode.episode_number);
                          }}
                        >
                         <EpisodeComponent episode={episode} playing={false}/>
                       </Link>
                     </div>
                  ))}
                  </div>
                </div>
              </div>
            {showPopup && vidKey.length > 0 && <YoutubeTrailer handleClose={togglePopup} vidId={vidKey[Math.floor(Math.random() * (vidKey.length-1 + 1)) + 0]}/>}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Overview;