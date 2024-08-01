import { FilterAlt} from "@mui/icons-material";
import { useState,useEffect } from "react"
import axios from '../axios';
import requests from "../request";
import { Link } from "react-router-dom";
import { Star } from "@mui/icons-material";
import Footer from "../Components/Footer";
import Pagination from "../Components/Pagination";
import { useLayoutEffect } from "react";
import FilterPopUp from "../Components/FilterPopUp";
import { bouncy } from 'ldrs'

bouncy.register()

interface Series {
  id: number,
  backdrop_path: string,
  poster_path: string,
  title: string,
  media_type: string,
  vote_average: number,
  name:string,
  first_air_date: string,
  release_date: string,
}

function Series() {
  const [page,setPage] = useState(1);
  const [series,setSeries] = useState<Series[]>([]);
  const [total_pages,setTotalPages] = useState(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const baseURL = "https://image.tmdb.org/t/p/original/";
  
  const handlePagination = (newPage: number) => {
    setPage(newPage);
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
}, [location.pathname]);

  useEffect(()=>{
    async function fetchData() {
        try{
            const fetchURL: string = `${requests.fetchTVList}&page=${page}&sort_by=popularity_desc`
            const request = await axios.get(fetchURL);
            const fetchedMovies = request.data.results;
            // const receivedPages = request.data.total_pages;
            setSeries(fetchedMovies);
            setTotalPages(500);
            return request;
        }
        catch(error){
            console.log("Error fetching data:",error);
        }
    }
    fetchData();
  },[page]);
  return (
    <div className="w-screen mt-20 p-0 relative m-0 h-full">
      <div className="px-6 py-4 min-h-screen">
          <div className="m-0">
            <span className="flex border-l-4 border-l-[#f3b83ae8] text-2xl px-2 items-center">
              <h2 className="font-['Barlow'] opacity-60 sm:text-xl lg:text-xl xl:text-xl ">Series Filter Results</h2>
              <FilterAlt style={{fontSize:"30px"}} className="cursor-pointer hover:text-[#f3b83ae8] transition duration-300 ease-in-out opacity-80" onClick={togglePopup}/>
            </span>
          </div>
          <div className="mt-2">
              <span className="object-contain flex items-center justify-center p-4 opacity-70">
              <Pagination
                currentPage={page}
                totalPages={total_pages}
                onPageChange={handlePagination}
              />
              </span>
          </div>
          {series && series.length>0? (
            <div className="px-6 grid grid-cols-4 h-full items-center justify-center mt-4 sm:grid-cols-1 lg:px-4 scroll-m-0 xl:px-4 xl:grid-cols-3 md:grid-cols-2">
            {series.map(serie=>(
                  <Link to={`/tv/${(serie?.title||serie?.name).toLowerCase().split(" ").join("-")}-${serie?.id}`} state={{serie}} className="m-4 flex flex-col justify-center p-0 items-center hover:opacity-60 transition ease-in-out duration-700 hover:scale-105" key={serie.id}>
                      <div key={serie.id} className="w-64 flex flex-col justify-between bg-black lg:w-52">
                          <img src={ serie?.backdrop_path? `${baseURL}${
                              serie?.backdrop_path||serie?.poster_path
                          }`:`https://placehold.co/100x60/000000/FFF`}
                          className='object-cover min-h-40 bg-black'
                          alt={serie?.name} />

                          <div className="px-2 w-full min-h-20 -my-2" style={{
                              background: "linear-gradient(10deg, transparent, rgba(0, 0, 0, .897))"
                          }}>
                              <span className="flex justify-between">                                
                                  <span style={{color:"#eccbafdd"}} className="flex font-['Barlow']">
                                          <Star style={{color:"#eccbafdd"}}/>
                                          <p className="mx-1">
                                              {Math.round(serie?.vote_average).toFixed(1)}
                                          </p>
                                  </span>
                              </span>
                              <span className="font-['Barlow'] lg:text-sm xl:text-sm">
                                  <p className="mt-2">{serie?.title || serie?.name}</p>
                              </span>
                              <span style={{color:"#eccbafdd"}} className="flex font-['Barlow_Condensed'] text-sm">
                                  <p>{serie?.first_air_date||serie?.release_date}</p>
                              </span>
                          </div>
                      </div>
                  </Link>
              ))}
              
              {showPopup && <FilterPopUp handleClose={togglePopup} search={false}/>}
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
          
        </div>
        <Footer/>
    </div>
  )
}

export default Series