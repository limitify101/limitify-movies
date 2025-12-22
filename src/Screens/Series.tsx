import { FilterAlt } from "@mui/icons-material";
import { useState, useEffect, useLayoutEffect } from "react";
import axios from "../axios";
import requests from "../request";
import { Link, useLocation } from "react-router-dom";
import { Star, Schedule } from "@mui/icons-material";
import Pagination from "../Components/Pagination";
import FilterPopUp from "../Components/FilterPopUp";
import OptimizedImage from "../Components/OptimizedImage";
import { filterReleasedContent, ContentItem } from "../utils/contentValidator";
import { isLikelyAvailable } from "../utils/videoAvailability";
import { bouncy } from "ldrs";

bouncy.register();

interface Series {
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

function Series() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [series, setSeries] = useState<Series[]>([]);
  const [total_pages, setTotalPages] = useState(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handlePagination = (newPage: number) => {
    setPage(newPage);
  };
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    async function fetchData() {
      try {
        // V2: Use release-filtered endpoint for accurate content
        const fetchURL: string = `${requests.fetchReleasedTV}&page=${page}`;
        const request = await axios.get(fetchURL);
        const fetchedSeries = request.data.results;

        // Additional client-side filtering for extra accuracy
        const validSeries = filterReleasedContent(
          fetchedSeries as ContentItem[],
          10
        ) as Series[];

        setSeries(validSeries);
        setTotalPages(Math.min(request.data.total_pages || 500, 500));
        return request;
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchData();
  }, [page]);
  return (
    <div className="w-screen mt-20 p-0 relative m-0 h-full">
      <div className="px-6 py-4 min-h-screen">
        <div className="m-0">
          <span className="flex border-l-4 border-l-[#f3b83ae8] text-2xl px-2 items-center">
            <h2 className="font-['Barlow'] opacity-60 sm:text-xl lg:text-xl xl:text-xl ">
              Series Filter Results
            </h2>
            <FilterAlt
              style={{ fontSize: "30px" }}
              className="cursor-pointer hover:text-[#f3b83ae8] transition duration-300 ease-in-out opacity-80"
              onClick={togglePopup}
            />
          </span>
        </div>

        {series && series.length > 0 ? (
          <div className="gap-12 grid grid-cols-4 h-full items-center justify-center mt-4 sm:grid-cols-1 scroll-m-0 xl:grid-cols-3 md:grid-cols-2">
            {series.map((serie) => (
              <Link
                to={`/tv/${serie?.id}`}
                state={{ serie }}
                className="m-4 flex-shrink-0 transition ease-in-out duration-300 hover:scale-105 group"
                key={serie.id}
              >
                <div className="w-80 h-[240px] sm:w-64 sm:h-[210px] lg:w-72 lg:h-[220px] xl:w-80 xl:h-[240px] md:w-72 md:h-[220px] flex flex-col relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-zinc-900">
                  {/* Availability Badge */}
                  {!isLikelyAvailable(
                    serie.release_date || serie.first_air_date
                  ) && (
                    <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-black px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-lg">
                      <Schedule fontSize="small" />
                      <span>SOON</span>
                    </div>
                  )}

                  <div className="h-2/3 w-full overflow-hidden">
                    <OptimizedImage
                      path={serie?.backdrop_path || serie?.poster_path}
                      alt={serie?.title || serie?.name || "Series"}
                      type="backdrop"
                      size="medium"
                      className="w-full h-full bg-black group-hover:opacity-80 transition-opacity duration-300"
                    />
                  </div>

                  <div className="px-3 py-2 flex-1 flex flex-col bg-gradient-to-t from-black via-zinc-900 to-transparent">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-['Barlow_Condensed'] bg-[#f3b83ae8] px-2 py-0.5 rounded-md text-black text-xs font-bold">
                        TV
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

            {showPopup && (
              <FilterPopUp handleClose={togglePopup} search={false} />
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center h-96">
            <l-bouncy size="45" speed="1.75" color="#f3b83ae8"></l-bouncy>
          </div>
        )}
        <div className="mt-2">
          <span className="object-contain flex items-center justify-center p-4 opacity-70">
            <Pagination
              currentPage={page}
              totalPages={total_pages}
              onPageChange={handlePagination}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Series;
