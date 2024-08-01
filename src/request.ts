const API_KEY = "78980d4205e269bf2cd8a7a8634a8097";

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchMovieList: `/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US`,
    fetchTVList: `/discover/tv?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US`,
    fetchMovieCast:`/movie/`
};
export default requests;


