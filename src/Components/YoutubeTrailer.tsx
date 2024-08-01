import React from "react";
import YouTube from 'react-youtube';

interface PopUpProps {
  handleClose: () => void;
  vidId: string;
}

const YoutubeTrailer: React.FC<PopUpProps> = ({ handleClose, vidId }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="z-50 bg-black p-6 rounded-lg shadow-lg relative min-w-96 min-h-60 ">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-white mb-5"
          onClick={handleClose}
        >
          <svg className="h-6 w-6 text-white hover:text-[#f3b632f4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="aspect-w-9 aspect-h-16 relative m-4">
          <YouTube videoId={vidId}/>
        </div>
      </div>
    </div>
  );
};

export default YoutubeTrailer;