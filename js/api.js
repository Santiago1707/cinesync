// js/api.js
import { TMDB_API_KEY } from './config.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTrendingMovies() {
    const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Películas en tendencia:', data.results);
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error; // Para que main.js capture el error
    }
}

export { fetchTrendingMovies };