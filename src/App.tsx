import { lazy, Suspense } from "react";
import Navbar from "./Components/Navbar";
import { Routes, Route } from "react-router-dom";
import { ring2 } from 'ldrs';
import Footer from "./Components/Footer";

// Register loader
ring2.register();

// Lazy load route components for better performance
const Home = lazy(() => import("./Screens/Home"));
const Movies = lazy(() => import("./Screens/Movies"));
const Series = lazy(() => import("./Screens/Series"));
const Overview = lazy(() => import("./Screens/Overview"));
const Watch = lazy(() => import("./Screens/Watch"));
const Search = lazy(() => import("./Screens/Search"));
const Upcoming = lazy(() => import("./Screens/Upcoming"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-neutral-950">
    <l-ring-2
      size="60"
      stroke="5"
      stroke-length="0.25"
      bg-opacity="0.1"
      speed="0.8"
      color="#f3b83ae8"
    />
  </div>
);

function App() {
  return (
    <>
      <div className="min-h-screen text-white flex flex-col bg-neutral-950 scroll-mx-0 m-0 p-0">
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <div className="flex-grow">
            <Routes>
              <Route path="/" index element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv" element={<Series />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/movies/:id" element={<Overview />} />
              <Route path="/tv/:id" element={<Overview />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/search/:query" element={<Search />} />
            </Routes>
          </div>
        </Suspense>
        <Footer/>
      </div>
    </>
  );
}

export default App;
