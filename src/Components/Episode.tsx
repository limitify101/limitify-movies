import React, { useState } from "react";
import { PlayCircle } from "@mui/icons-material"; // Assuming PlayCircle is imported from MUI
interface Episode {
  id: number;
  still_path: string;
  title: string;
  name: string;
  episode_number: number;
}

const baseURL = "https://image.tmdb.org/t/p/original";

interface EpisodeComponentProps {
  episode: Episode;
  playing: boolean;
}

const EpisodeComponent: React.FC<EpisodeComponentProps>= ({ episode , playing}) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const playCircleColorClass = isHovered ? "text-[#f3b83ae8]" : "text-white";

  return (
    <div
      className="mr-8 flex flex-col justify-center p-0 items-center hover:opacity-60 transition ease-in-out duration-700 hover:scale-105"
      key={episode.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div key={episode.id} className="flex flex-col justify-between w-56 sm:w-52 lg:w-56 xl:w-52">
        <div className={`${playing?'visible':'hidden'} w-2/5 -mb-6 z-50 text-black bg-[#f3b632f4] font-['Arvo'] flex items-center justify-center`}>
          <p>On Air</p>
        </div>
        <div className="flex flex-col items-center h-32 object-contain">
          <img
            src={`${baseURL}${episode?.still_path}`}
            className="w-50 h-32 object-cover bg-zinc-900"
            alt={episode.name}
          />
          <PlayCircle
            className={`-mt-20 ${playCircleColorClass}`}
            fontSize="large"
          />
        </div>
        <div
          className="px-2 w-full min-h-10 text-sm font-light bg-[#0000005b] shadow-md"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <span className="font-['Barlow'] flex flex-col justify-center">
            <p>{`Episode ${episode.episode_number}:`}</p>
            <p className="mt-2 font-medium font-['Barlow_Condensed']">
              {episode?.title || episode?.name}
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EpisodeComponent;
