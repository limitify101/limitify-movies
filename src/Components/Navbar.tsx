import React, { useState, useEffect, useRef } from "react";
import { Search } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import SearchDropdown from "./SearchDropdown";
import { API_CONFIG, getAuthHeaders } from "../config/api";

interface SearchResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const Navbar: React.FC = () => {
  const [query, setQueryTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLLIElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedDesktopSearch =
        searchRef.current?.contains(event.target as Node) ?? false;
      const clickedMobileSearch =
        mobileSearchRef.current?.contains(event.target as Node) ?? false;

      if (!clickedDesktopSearch && !clickedMobileSearch) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
          { headers: getAuthHeaders() },
        );
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowDropdown(true);
        setIsSearching(false);
      } catch (error) {
        console.error("Search error:", error);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toLowerCase();
    setQueryTerm(value);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredResults = searchResults
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .slice(0, 8);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && filteredResults[highlightedIndex]) {
        const result = filteredResults[highlightedIndex];
        const isMovie = result.media_type === "movie";
        navigate(isMovie ? `/movies/${result.id}` : `/tv/${result.id}`, {
          state: { [isMovie ? "movie" : "serie"]: result },
        });
        setShowDropdown(false);
        setQueryTerm("");
      } else if (query.trim()) {
        navigate(`/search/${query.toLowerCase().split(" ").join("-")}`, {
          state: { term: query },
        });
        setShowDropdown(false);
        handleClose();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const handleDropdownResultClick = () => {
    setShowDropdown(false);
    setQueryTerm("");
    setHighlightedIndex(-1);
  };

  return (
    <>
      <div
        className="flex flex-row items-center justify-between h-20 px-6 fixed left-0 right-0 w-full m-0 top-0 z-50 lg:h-16 xl:h-16"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(10, 8, 8), #212426)",
        }}
      >
        <div>
          <a href="/">
            <span className="font-['Bebas_Neue'] text-3xl bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer sm:text-2xl lg:text-xl xl:text-xl md:text-xl">
              LIMITIFY | MOVIES
            </span>
          </a>
        </div>
        <div className="w-1/3 flex justify-start text-xl font-['Barlow_Condensed'] sm:hidden lg:text-sm xl:text-sm md:text-sm">
          <Link to="/movies">
            <span className="mx-4 bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer hover:text-[#f3b83ae8] transition">
              Movies
            </span>
          </Link>
          <Link to="/tv">
            <span className="mx-4 bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer hover:text-[#f3b83ae8] transition">
              TV Shows
            </span>
          </Link>
          <Link to="/upcoming">
            <span className="mx-4 bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer hover:text-[#f3b83ae8] transition">
              Coming Soon
            </span>
          </Link>
        </div>
        <div
          className="bg-[#1f2123] font-['Barlow_Condensed'] w-1/3 p-3 text-xl rounded-md shadow-sm flex sm:hidden lg:p-1 xl:p-1 md:p-1 relative"
          ref={searchRef}
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent w-full m-0 outline-none opacity-60 lg:text-sm lg:p-2 xl:p-2 xl:text-sm md:text-sm md:p-2"
            value={query}
            onChange={handleQuery}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            required
          />
          <Link
            to={`/search/${query.toLowerCase().split(" ").join("-")}`}
            state={{ term: query }}
            onClick={() => setShowDropdown(false)}
          >
            <Search
              sx={{ color: "#eccbafdd" }}
              className="cursor-pointer"
              fontSize={"small"}
            />
          </Link>
          {showDropdown && (
            <SearchDropdown
              results={searchResults}
              isLoading={isSearching}
              onResultClick={handleDropdownResultClick}
              highlightedIndex={highlightedIndex}
            />
          )}
        </div>
        <div className="hidden sm:inline">
          <button
            onClick={handleClick}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MenuIcon sx={{ color: "#eccbafdd" }} className="cursor-pointer" />
          </button>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            overflow: "visible",
          },
        }}
        slotProps={{
          paper: {
            sx: {
              width: "min(92vw, 400px)",
              marginTop: "25px",
              backgroundImage:
                "linear-gradient(180deg, rgba(10, 8, 8), #212426)",
              overflow: "visible",
            },
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          style={{ fontFamily: "Barlow Condensed" }}
        >
          <Link to="/movies" className="w-full">
            <span className="bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer">
              Movies
            </span>
          </Link>
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          style={{ fontFamily: "Barlow Condensed" }}
        >
          <Link to="/tv" className="w-full">
            <span className="bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer">
              TV Shows
            </span>
          </Link>
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          style={{ fontFamily: "Barlow Condensed" }}
        >
          <Link to="/upcoming" className="w-full">
            <span className="bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer">
              Coming Soon
            </span>
          </Link>
        </MenuItem>
        <MenuItem
          style={{
            color: "#eccbafdd",
            fontFamily: "Barlow Condensed",
            position: "relative",
          }}
          ref={mobileSearchRef}
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent w-full m-0 h-full outline-none opacity-60"
            value={query}
            onChange={handleQuery}
            onKeyDownCapture={(e) => e.stopPropagation()}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
          />
          <Link
            to={`/search/${query.toLowerCase().split(" ").join("-")}`}
            state={{ term: query }}
            onClick={() => setShowDropdown(false)}
          >
            <Search sx={{ color: "#eccbafdd" }} className="cursor-pointer" />
          </Link>
          {showDropdown && (
            <SearchDropdown
              results={searchResults}
              isLoading={isSearching}
              onResultClick={handleDropdownResultClick}
              highlightedIndex={highlightedIndex}
            />
          )}
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
