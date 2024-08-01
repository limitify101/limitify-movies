import React, { useState } from 'react';
import { Search } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const Navbar: React.FC = () => {
  const [query, setQueryTerm] = useState<string>('');
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryTerm(e.currentTarget.value.trim().toLowerCase());
  };
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if(e.currentTarget.value.trim() === ""){
        return
      }
      navigate(`/search/${query.toLowerCase().split(' ').join('-')}`, { state: {term:query} });
      handleClose();
    }
  };


  return (
    <>
      <div className='flex flex-row items-center justify-between h-20 px-6 fixed w-screen m-0 top-0 z-50 lg:h-16 xl:h-16'
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(10, 8, 8), #212426)",
        }}>
        <div>
          <a href="/">
            <span className="font-['Bebas_Neue'] text-3xl bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer sm:text-2xl lg:text-xl xl:text-xl md:text-xl">
              LIMITIFY | MOVIES
            </span>
          </a>
        </div>
        <div className="w-1/3 flex justify-start text-xl font-['Barlow_Condensed'] sm:hidden lg:text-sm xl:text-sm md:text-sm">
          <Link to="/movies"><span className='mx-4 bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer'>Movies</span></Link>
          <Link to="/tv"><span className='mx-4 bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer'>TV Shows</span></Link>
        </div>
        <div className="bg-[#1f2123] font-['Barlow_Condensed'] w-1/3 p-3 text-xl rounded-md shadow-sm flex sm:hidden lg:p-1 xl:p-1 md:p-1">
          <input
            type="text"
            placeholder='Search'
            className='bg-transparent w-full m-0 outline-none opacity-60 lg:text-sm lg:p-2 xl:p-2 xl:text-sm md:text-sm md:p-2'
            onChange={handleQuery}
            onKeyDown={handleSearch}
            required
          />
          <Link to={`/search/${query.toLowerCase().split(" ").join("-")}`} state={{ term:query }}>
            <Search sx={{ color: "#eccbafdd" }} className='cursor-pointer' fontSize={"small"}/>
          </Link>
        </div>
        <div className='hidden sm:inline'>
          <button
            onClick={handleClick}
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MenuIcon sx={{ color: "#eccbafdd" }} className='cursor-pointer' />
          </button>
        </div>
      </div>
      <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          slotProps={{
            paper: {
                  style: {
                        width: 400,
                        marginTop: "25px",
                        backgroundImage: "linear-gradient(180deg, rgba(10, 8, 8), #212426)",
                    },
             },
        }}
            >
          <MenuItem onClick={handleClose} style={{fontFamily:"Barlow Condensed"}}>
            <Link to="/movies" className='w-full'><span className='bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer'>Movies</span></Link>
          </MenuItem>
          <MenuItem onClick={handleClose} style={{fontFamily:"Barlow Condensed"}}>
            <Link to="/tv" className='w-full'><span className='bg-clip-text text-transparent bg-[#eccbafdd] cursor-pointer'>TV Shows</span></Link>
          </MenuItem>
          <MenuItem style={{color:"#eccbafdd",fontFamily:"Barlow Condensed"}}>
            <input
              type="text"
              placeholder='Search'
              className='bg-transparent w-full m-0 h-full outline-none opacity-60'
              onChange={handleQuery}
              onKeyDown={handleSearch}
            />
            <Link to={`/search/${query.toLowerCase().split(" ").join("-")}`} state={{ term:query }}>
              <Search sx={{ color: "#eccbafdd" }} className='cursor-pointer' />
            </Link>
          </MenuItem>
        </Menu>
    </>
  );
}

export default Navbar;
