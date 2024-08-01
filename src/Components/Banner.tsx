import React,{ useState, useEffect } from 'react';
import requests from '../request';
import axios from '../axios';
import { Movie, PlayCircle} from '@mui/icons-material';
import { Link } from 'react-router-dom';

type Movie = typeof initMovie;
const initMovie = {
    id:0,
    backdrop_path: "",
    title: "",
    name: "",
    original_name: "",
    overview: "",
    vote_average: 0,
    media_type:"",
}

const Banner:React.FC = () => {
    const [movieUp, setMovie] = useState<Movie>(initMovie);
    const[serieUp,setSerie]= useState<Movie>(initMovie);
    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(requests.fetchTrending);
                const randomIndex = Math.floor(Math.random() * request.data.results.length);
                const randomMovie = request.data.results[randomIndex];
                setMovie(randomMovie);
                setSerie(randomMovie);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);
    if (!movieUp?.backdrop_path) {
        return null;
    }
    function truncate(string: string, n: number) {
        return string?.length > n ? string.substring(0, n - 1) + "..." : string;
    }
    
    return (
        <div className='bg-zinc-950 mt-20 p-0 relative m-0 h-5/6 lg:mt-16 lg:w-full xl:w-full xl:mt-16 md:w-full'>
            <header className='bg-transparent p-0 h-full relative m-0 bg-cover bg-no-repeat bg-top sm:bg-center lg:w-screen xl:w-screen md:w-screen'
                style={{
                    backgroundImage: `url("https://image.tmdb.org/t/p/original/${movieUp?.backdrop_path}")`,
                }}>
                <div className='h-full flex flex-col items-start justify-end px-6'>
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
                    md:text-3xl"
                        style={{
                            // background: "linear-gradient(180deg, #ffc694, rgba(248, 199, 119, .527))",
                            // backgroundClip: "text",
                            color: "#000",
                            fontWeight: "800",
                            letterSpacing: "1px",
                        }}>{movieUp?.title || movieUp?.name || movieUp?.original_name}</h1>
                    <div className='mb-5 w-36 sm:scale-90 lg:scale-90'>
                        <Link to={`/watch/${(movieUp?.title || movieUp?.name).toLowerCase().split(" ").join("-")}-${movieUp?.id}`} state={movieUp.media_type === "movie"?{movieUp}:{serieUp}}
                        className=" bg-black rounded-md p-3 border-l-4 border-l-[#f3b83ae8] font-['Barlow_Condensed'] text-xl lg:text-lg xl:text-lg sm:text-lg md:text-lg w-full flex items-center justify-center hover:opacity-50 hover:bg-[#f3b83ae8] hover:text-black duration-200 ease-in-out hover:border-l-0 hover:border-neutral-900">
                            <PlayCircle/>
                            <span className='w-full mx-1'>WATCH NOW</span>
                        </Link>
                    </div>
                    <div className="w-3/5 mb-10 min-h-24 rounded-md p-2 flex flex-col items-start justify-center font-['Barlow'] italic font-light shadow-sm sm:w-full lg:w-4/5"
                        style={{
                            background: "linear-gradient(1turn, transparent, rgba(0, 0, 0, .897))",
                        }}>
                        <h3 className="flex-1  text-[#ecd364] lg:text-sm sm:text-sm xl:text-sm md:text-sm">
                            {truncate(movieUp?.overview, 150)}
                        </h3>
                        <span className='my-2 flex-2 flex w-1/2 font-thin'>
                            <p>Rating: {Math.round(movieUp?.vote_average).toFixed(1)}</p>
                        </span>
                    </div>
                </div>
            
            </header>
            <div className='h-16 w-full absolute bg-[#000000f0] -mt-6 blur-md'></div>
        </div>
    )
}

export default Banner;
