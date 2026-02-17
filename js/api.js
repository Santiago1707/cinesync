// js/api.js
// IMPORTANTE: Esto es temporal para que el proyecto funcione

const TMDB_API_KEY = '74fda485b189f4e9e123a96d528664d4';      
const WATCHMODE_API_KEY = 'QFDbSe0Y1Rg8YegIMjy8GTNBSTqQr4I1r43A5w87'; 

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/api/v1';

// Función existente
async function fetchTrendingMovies() {
    const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Películas en tendencia:', data.results);
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

// NUEVA: Buscar películas
async function searchMovies(query) {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

// NUEVA: Obtener providers de streaming
async function getStreamingProviders(movieId) {
    // Primero necesitamos el ID de Watchmode (busca por TMDB ID)
    const searchUrl = `${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=id_tmdb&search_value=${movieId}`;

    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.title_results && searchData.title_results.length > 0) {
            const watchmodeId = searchData.title_results[0].id;

            // Ahora obtenemos las fuentes (providers)
            const sourcesUrl = `${WATCHMODE_BASE_URL}/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
            const sourcesResponse = await fetch(sourcesUrl);
            const sources = await sourcesResponse.json();

            // Filtramos solo servicios de streaming (no compra/alquiler)
            return sources.filter(source => source.type === 'sub').slice(0, 5);
        }
        return [];
    } catch (error) {
        console.error('Error fetching streaming providers:', error);
        return [];
    }
}

// Exportamos TODAS las funciones
export { fetchTrendingMovies, searchMovies, getStreamingProviders };