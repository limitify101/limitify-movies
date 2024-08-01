import Navbar from "./Components/Navbar"
import {Routes,Route} from "react-router-dom";
import Home from "./Screens/Home";
import Movies from "./Screens/Movies";
import Series from "./Screens/Series";
import Overview from "./Screens/Overview";
import Watch from "./Screens/Watch";
import Search from "./Screens/Search";
function App() {

  return (
    <>
      <div className="h-screen text-white flex flex-col bg-neutral-950 scroll-mx-0 m-0 p-0">
        <Navbar/>
          <Routes>
            <Route path="/" index element={<Home/>}/>
            <Route path="/movies" element={<Movies/>}/>
            <Route path="/tv" element={<Series/>}/>
            <Route path="/movies/:id" element={<Overview/>}/>
            <Route path="/tv/:id" element={<Overview/>}/>
            <Route path="/watch/:id" element={<Watch/>}/>
            <Route path="/search/:query" element={<Search/>}/>
          </Routes>
      </div>
    </>
  )
}

export default App
