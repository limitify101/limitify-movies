import { API_CONFIG } from './config/api';

const API_KEY = API_CONFIG.TMDB_API_KEY;

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchMovieList: `/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`,
    fetchTVList: `/discover/tv?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`,
    fetchMovieCast: `/movie/`,
    // V2: Release date filtering for accurate content
    fetchReleasedMovies: `/discover/movie?api_key=${API_KEY}&include_adult=false&language=en-US&release_date.lte=${new Date().toISOString().split('T')[0]}&sort_by=popularity.desc&vote_count.gte=10`,
    fetchReleasedTV: `/discover/tv?api_key=${API_KEY}&include_adult=false&language=en-US&first_air_date.lte=${new Date().toISOString().split('T')[0]}&sort_by=popularity.desc&vote_count.gte=10`,
    fetchUpcomingMovies: `/discover/movie?api_key=${API_KEY}&include_adult=false&language=en-US&release_date.gte=${new Date().toISOString().split('T')[0]}&sort_by=popularity.desc`,
    fetchUpcomingTV: `/discover/tv?api_key=${API_KEY}&include_adult=false&language=en-US&first_air_date.gte=${new Date().toISOString().split('T')[0]}&sort_by=popularity.desc`
};
export default requests;


