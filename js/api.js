// js/api.js
// const TMDB_API_KEY = 'TU_API_KEY_AQUI'; // La clave real debe estar en un archivo ignorado
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchTrendingMovies() {
    const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Películas en tendencia:', data.results);
        return data.results; // Esto será un array de películas
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Para hacerla disponible en otros archivos
export { fetchTrendingMovies };