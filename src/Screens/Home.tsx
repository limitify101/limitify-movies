import Banner from "../Components/Banner";
import Row from "../Components/Row";
import requests from "../request";

function Home() {
  return (
    <div className="min-h-screen p-0 w-screen scroll-m-0">
      <Banner/>
      <div>
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
    </div>
  );
}

export default Home;
