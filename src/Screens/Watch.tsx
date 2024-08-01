import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Videocam, ListOutlined, PlayCircle} from "@mui/icons-material";
import { genreIds } from "../genreIds";
import Footer from "../Components/Footer";
import YoutubeTrailer from "../Components/YoutubeTrailer";
import EpisodeComponent from "../Components/Episode";

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
const Watch = () => {
  const location = useLocation();
  const [movieWatch, setMovieToWatch] = useState<Content>(initContent);
  const [serieWatch, setSerieToWatch] = useState<Content>(initContent);
  const [vidKey, setVidKey] = useState<[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [movieCast, setMovieCast] = useState<Cast[]>([]);
  const [tvCast, setTvCast] = useState<Cast[]>([]);
  const [seasons,setSeasons] = useState<[]>([]);
  const [episodes,setEpisodes] = useState<[]>([]);
  const [server,setServer] = useState(1);
  const [serverLink,setServerLink] = useState("");
  const [seasonAir,setSeasonAir] = useState(1);
  const [episodeAir,setEpisodeAir] = useState(1);
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
  //Respond to buttons changing the server to stream video
  function changeServer(e:any){
    const sv = parseInt(e.currentTarget.value);
    setServer(sv);
  }
  function handleEpisode(episodeNumber:number){
    setEpisodeAir(episodeNumber);
  }
  useEffect(() => {
    if(location.state?.seasonSelected){
      const seasonPlaying = location.state?.seasonSelected;
      setSeasonAir(seasonPlaying);
      location.state.seasonSelected = null;
    }
    if(location.state?.episodeSelected){
      const episodePlaying = location.state?.episodeSelected;
      setEpisodeAir(episodePlaying);
      location.state.episodeSelected = null;
    }
    const linkProvider = (id: number, type: string): string => {
      if (server === 2) {
        return type==="movie"? `https://vidsrc.to/embed/${type}/${id}`:`https://vidsrc.to/embed/${type}/${id}/${seasonAir}/${episodeAir}`;
      } else if (server === 1) {
        return type==="tv"? (`https://multiembed.mov/?video_id=${id}&tmdb=1&s=${seasonAir}&e=${episodeAir}`):(`https://multiembed.mov/?video_id=${id}&tmdb=1`);
      }
      return "";
    };
  
    const fetchMovieAndCast = async () => {
      if (location.state?.movieUp) {
        const movie = location.state?.movieUp as Content;
        
        setMovieToWatch(movie);
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/${movie.media_type || "movie"}/${movie.id}/credits?language=en-US`,
            options
          );
          const data = await response.json();
          const casts = data.cast;
          setMovieCast(casts);
  
          // Call fetchVideoTrailer after setting movieWatch state
          fetchVideoTrailer(movie.id, movie.media_type || "movie");
          
          // Set the server link for movie
          setServerLink(linkProvider(movie.id, "movie"));
        } catch (error) {
          console.log("Error fetching movie data:", error);
          setMovieCast([]);
        }
      }
  
      if (location.state?.serieUp) {
        const serie = location.state?.serieUp as Content;
        
        setSerieToWatch(serie);
        
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/tv/${serie.id}/credits?language=en-US`,
            options
          );
          const data = await response.json();
          const casts = data.cast;
          setTvCast(casts);
  
          // Call fetchVideoTrailer after setting serieUp state
          fetchVideoTrailer(serie.id, serie.media_type || "tv");
          fetchSeasons(serie.id);
          fetchEpisodes(serie.id, seasonAir);
  
          // Set the server link for series
          setServerLink(linkProvider(serie.id, "tv"));
        } catch (error) {
          console.log("Error fetching serie data:", error);
          setTvCast([]);
        }
      }
    };
  
    // Fetch movie and cast information
    fetchMovieAndCast();
  }, [location.state?.movieUp, location.state?.serieUp, server,seasonAir,episodeAir,location.state?.seasonSelected,location.state?.episodeSelected]);
  

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
      <div className="w-screen min-h-screen">
        {movieWatch.id !== 0 && (
          <div className="w-screen mt-20 p-0 relative m-0 h-full bg-[#0000005b]">
          <div className="w-full h-screen sm:h-5/6 flex items-center justify-center p-4 bg-zinc-950 flex-col">
            <iframe style={{border:0}} className="bg-[#0000005b] -mt-10 w-4/5 h-3/4" src={serverLink||""} allowFullScreen></iframe>
            <div className="w-full flex flex-col items-center justify-center mt-5 py-4">
            <p className="font-['Barlow'] font-light opacity-65 text-center w-full">If current server doesn't work please try other servers below</p>
              <div className="flex mt-4">
                <button className="p-2 mx-4 border rounded-md hover:text-[#f3b632f4] hover:border-[#f3b632f4] duration-200" onClick={changeServer} value={1} role="button">
                  <PlayCircle/>
                  <span className="mx-2">Server 1</span>
                </button>
                <button className="p-2 mx-4 border rounded-md hover:text-[#f3b632f4] hover:border-[#f3b632f4] duration-200" onClick={changeServer} value={2} role="button">
                  <PlayCircle/>
                  <span className="mx-2">Server 2</span>
                </button>
              </div>
            </div>
          </div>
            <div
              className="flex w-4/5 rounded-lg bg-[#0000005b] h-3/4 mb-20 sm:flex-col sm:w-full sm:h-5/6 py-2"
            >
              <div className="flex justify-center items-center w-2/5 sm:w-full">
                <img
                  src={`${baseURL}${movieWatch.poster_path}`}
                  alt="Movie Poster"
                  className="h-2/3 rounded-sm w-2/5 sm:w-36 sm:h-52"
                />
              </div>
              <div className="flex flex-col w-3/5 justify-center sm:w-full sm:items-center">
                <div
                  className="font-['Arvo'] text-2xl bg-clip-text sm:text-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg, #fcd4af, rgba(255, 252, 247, .534))",
                    WebkitTextFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  <h3>
                    {(movieWatch.title || movieWatch.name || movieWatch.original_title)
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
                      IMDB:{Math.round(movieWatch.vote_average).toFixed(1)}
                    </div>
                  </span>
                  <span></span>
                </div>
                <div className="w-full p-2 font-['Barlow'] font-light">
                  <h4>Overview:</h4>
                  <p className="font-['Barlow'] italic font-light h-fit text-sm">
                    {movieWatch.overview||"NaN"}
                  </p>
                  <span className="flex justify-between w-1/2 my-1 sm:w-3/4">
                    <div className="flex">
                      <h4>Released:</h4>
                      <p>{movieWatch.release_date||"NaN"}</p>
                    </div>
                    <div className="flex">
                      <h4>Language:</h4>
                      <p>{movieWatch.original_language}</p>
                    </div>
                  </span>
                  <span className="flex my-1">
                    <h4>Genre:</h4>
                    <p>{filterGenres(movieWatch.genre_ids).join(",")||"NaN"}</p>
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
                            className="flex flex-col justify-center p-0 items-center object-contain"
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
                                className="rounded-md sm:w-20 sm:h-32 w-20 h-36"
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
            
            {showPopup && vidKey.length > 0 && <YoutubeTrailer handleClose={togglePopup} vidId={vidKey[Math.floor(Math.random() * (vidKey.length-1 + 1)) + 0]} />}
          </div>
        )}
        {serieWatch.id !== 0 && (
          <>
            <div className="w-screen mt-20 p-0 relative m-0 h-full bg-[#0000005b]">
                <div className="w-full h-screen sm:h-5/6 flex items-center justify-center p-4 bg-zinc-950 flex-col">
                  <iframe style={{border:0}} className="bg-[#0000005b] -mt-10 w-4/5 h-3/4 sm:h-3/5 sm:w-5/6" src={serverLink} allowFullScreen></iframe>
                  <div className="w-full flex flex-col items-center justify-center mt-5 py-4">
                    <p className="font-['Barlow'] font-light opacity-65 text-center w-full">If current server doesn't work please try other servers below</p>
                    <div className="flex mt-4 sm:scale-90">
                      <button className="p-2 mx-4 border rounded-md hover:text-[#f3b632f4] duration-200 hover:border-[#f3b632f4]" onClick={changeServer} value={1}>
                        <PlayCircle/>
                        <span className="mx-2">Server 1</span>
                      </button>
                      <button className="p-2 mx-4 border rounded-md hover:text-[#f3b632f4] duration-200 hover:border-[#f3b632f4]" onClick={changeServer} value={2}>
                        <PlayCircle/>
                        <span className="mx-2">Server 2</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-screen px-6">
                  <div className="object-contain text-white flex rounded-md w-32 p-2 border justify-between font-light font-['Barlow'] cursor-pointer bg-black">
                    <ListOutlined/>
                    <select 
                      name="Seasons" 
                      id="Seasons" 
                      className="bg-transparent outline-none w-24 cursor-pointer"
                      onChange={(e)=>{
                        const sn = parseInt(e.target.value.split(" ")[1],10);
                        fetchEpisodes(serieWatch.id,sn);
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
                     <div key={episode.id} onClick={()=>handleEpisode(episode.episode_number)}>
                       <EpisodeComponent episode={episode} playing={episodeAir === episode.episode_number ? true:false}/>
                     </div>
                  ))}
                  </div>
                </div>
                <div
                  className="flex w-4/5 rounded-lg bg-[#0000005b] h-3/4 mb-20 sm:flex-col sm:w-full sm:h-5/6 py-2 justify-center items-center"
                  style={{
                    backdropFilter: "blur(5px)",
                  }}
                >
                <div className="flex justify-center items-center w-2/5 sm:w-full">
                  <img
                    src={`${baseURL}${serieWatch.poster_path}`}
                    alt="Serie Poster"
                    className="h-1/2 rounded-sm w-1/2 sm:w-36 sm:h-52"
                  />
                </div>
                <div className="flex flex-col w-3/5 justify-center sm:w-full sm:items-center">
                  <div
                    className="font-['Arvo'] text-2xl bg-clip-text sm:text-2xl"
                    style={{
                      background:
                        "linear-gradient(180deg, #fcd4af, rgba(255, 252, 247, .534))",
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    <h3>
                      {(serieWatch.title || serieWatch.name || serieWatch.original_title)
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
                        IMDB:{Math.round(serieWatch.vote_average).toFixed(1)}
                      </div>
                    </span>
                    <span></span>
                  </div>
                  
                  <div className="w-full p-2 font-['Barlow'] font-light">
                    <h4>Overview:</h4>
                    <p className="font-['Barlow'] italic font-light h-fit text-sm">
                      {serieWatch.overview||"NaN"}
                    </p>
                    <span className="flex justify-between w-1/2 my-1 sm:w-3/4">
                      <div className="flex">
                        <h4>Released:</h4>
                        <p>{serieWatch.release_date || "NaN"}</p>
                      </div>
                      <div className="flex">
                        <h4>Language:</h4>
                        <p>{serieWatch.original_language}</p>
                      </div>
                    </span>
                    <span className="flex my-1">
                      <h4>Genre:</h4>
                      <p>{filterGenres(serieWatch.genre_ids).join(",")||"NaN"}</p>
                    </span>
                    <span className="flex flex-col">
                      <h4>Casts:</h4>
                      {tvCast && tvCast.length > 0 ? (
                        <div
                          className="flex overflow-y-hidden overflow-x-scroll w-full p-0 items-center object-contain"
                          style={{
                            scrollbarWidth: "none",
                          }}
                        >
                          {tvCast.map((cast) => (
                            <div
                              className="flex flex-col justify-center p-0 items-center object-contain"
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
                                  className="rounded-md sm:w-20 sm:h-48 w-20 h-36"
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
            {showPopup && vidKey.length > 0 && <YoutubeTrailer handleClose={togglePopup} vidId={vidKey[Math.floor(Math.random() * (vidKey.length-1 + 1)) + 0]}/>}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Watch;