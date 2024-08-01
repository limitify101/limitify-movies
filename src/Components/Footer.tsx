import logo from "../assets/orginal_logo.ico";

function Footer() {
    const year:number = new Date().getFullYear();
  return (
    <div className='h-16 bottom-0 bg-black flex flex-row items-center justify-between px-6 m-0'>
        <div className="flex flex-row w-1/5 font-['Barlow_Condensed'] bg-clip-text text-transparent bg-[#eccbafdd] text-xl sm:w-3/4 sm:text-lg lg:text-lg xl:text-lg md:text-lg md:w-3/4">
            <span className="mx-2">{year}</span>
            <p>Powered by LIMITIFY</p>
        </div>
        <div className="w-16 h-16 sm:w-12 sm:h-12 lg:h-14 xl:h-14 md:h-12 md:w-12">
            <img src={logo} alt="LIMITIFY" className="min-h-4 min-w-4"/>
        </div>
    </div>
  )
}

export default Footer