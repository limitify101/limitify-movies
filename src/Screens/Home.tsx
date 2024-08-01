import Banner from "../Components/Banner"
import Footer from "../Components/Footer"
import Row from "../Components/Row"
import requests from "../request"

function Home() {
  return (
    <div className="w-screen m-0 p-0 h-full lg:w-screen scroll-m-0">
        <Banner/>
        <div className="min-h-screen">
          <Row
              title="Trending Now"
              fetchURL={requests.fetchTrending}
              isLargeRow={true}
          />
          <Row
              title="Netflix Originals"
              fetchURL={requests.fetchTrending}
              isLargeRow={false}
          />
        </div>
        <Footer/>
    </div>
  )
}

export default Home