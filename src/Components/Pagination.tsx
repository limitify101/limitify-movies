import { ArrowBack, ArrowForward, KeyboardDoubleArrowLeftSharp, LastPage } from "@mui/icons-material";

type Props = {
  currentPage:any;
  totalPages:any;
  onPageChange:any;
}
const Pagination = ({ currentPage, totalPages, onPageChange}:Props) => {
  const maxPagesToShow = 3; // Number of pages to show in pagination

  const renderPageButtons = () => {
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <button
          key={page}
          className={`${currentPage === page ? 'bg-[#f3b83ae8]':'bg-zinc-800'} text-white rounded-full p-4 mx-2 w-12 h-12 sm:w-10 sm:h-10 xl:w-10 xl:h-10 lg:w-10 lg:h-10 flex items-center justify-center duration-300 sm:text-sm`}
          value={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <span className="object-contain flex items-center justify-center p-4">
      <button
        className={`bg-zinc-800 text-white rounded-full p-4 mx-2 sm:w-10 sm:h-10 lg:h-10 lg:w-10 xl:w-10 xl:h-10 w-12 h-12 flex items-center justify-center hover:opacity-60 duration-300 ${
          currentPage === 1 ? "bg-[#f3b83ae8]" : ""
        }`}
        value={1}
        onClick={() => onPageChange(1)}
      >
        <KeyboardDoubleArrowLeftSharp/>
      </button>
      {currentPage > 1 && (
        <button
          className="bg-zinc-800 text-white rounded-full p-4 mx-2 w-12 h-12  sm:w-10 sm:h-10 lg:w-10 lg:h-10 xl:h-10 xl:w-10 flex items-center justify-center hover:opacity-60 duration-300"
          value={currentPage - 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ArrowBack/>
        </button>
      )}
      {renderPageButtons()}
      {currentPage < totalPages && (
        <button
          className="bg-zinc-800 text-white rounded-full p-4 mx-2 w-12 h-12 sm:w-10 lg:w-10 lg:h-10 sm:h-10 xl:w-10 xl:h-10 flex items-center justify-center hover:opacity-60 duration-300"
          value={currentPage + 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ArrowForward/>
        </button>
      )}
      <button
        className={`bg-zinc-800 text-white rounded-full p-4 mx-2 w-12 h-12 sm:w-10 sm:h-10 lg:h-10 lg:w-10 xl:w-10 xl:h-10 flex items-center justify-center hover:opacity-60 duration-300 ${
          currentPage === totalPages ? "bg-[#f3b83ae8]" : ""
        }`}
        value={totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <LastPage/>
      </button>
    </span>
  );
};

export default Pagination;