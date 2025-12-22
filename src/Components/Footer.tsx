import logo from "../assets/limitify.png";

function Footer() {
  const year: number = new Date().getFullYear();
  return (
    <div className="h-16 bg-black flex flex-row items-center justify-between px-4 sm:px-6 m-0 mt-auto w-full flex-shrink-0">
      <div className="flex flex-row items-center gap-2 font-['Barlow_Condensed'] bg-clip-text text-transparent bg-[#eccbafdd] text-base sm:text-lg md:text-xl">
        <span>{year}</span>
        <p>LIMITIFY | MOVIES</p>
      </div>
      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
        <img src={logo} alt="LIMITIFY" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

export default Footer;
