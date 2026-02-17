// js/api.js
// Módulo para manejar todas las llamadas a APIs externas
// TMDB (The Movie Database) y Watchmode

// ============================================
// CONFIGURACIÓN DE APIS
// ============================================

const TMDB_API_KEY = '74fda485b189f4e9e123a96d528664d4';       
const WATCHMODE_API_KEY = 'QFDbSe0Y1Rg8YegIMjy8GTNBSTqQr4I1r43A5w87'; 

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/api/v1';

// ============================================
// FUNCIONES DE TMDB (The Movie Database)
// ============================================

/**
 * Obtiene películas en tendencia de la semana
 * @returns {Promise<Array>} Array de películas
 */
async function fetchTrendingMovies() {
    const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Películas en tendencia cargadas:', data.results.length);
        return data.results;
    } catch (error) {
        console.error('❌ Error fetching trending movies:', error);
        throw error;
    }
}

/**
 * Busca películas por título
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Array de películas encontradas
 */
async function searchMovies(query) {
    if (!query || query.trim() === '') {
        return [];
    }

    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Búsqueda para "${query}":`, data.results.length, 'resultados');
        return data.results;
    } catch (error) {
        console.error('❌ Error searching movies:', error);
        return [];
    }
}

/**
 * Obtiene detalles completos de una película por su ID
 * @param {number} movieId - ID de TMDB de la película
 * @returns {Promise<Object>} Detalles de la película
 */
async function fetchMovieDetails(movieId) {
    if (!movieId) {
        console.error('❌ No movie ID provided');
        return null;
    }

    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,videos`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Detalles cargados para película ID ${movieId}:`, data.title);
        return data;
    } catch (error) {
        console.error(`❌ Error fetching movie details for ID ${movieId}:`, error);
        return null;
    }
}

/**
 * Obtiene películas populares (alternativa a trending)
 * @returns {Promise<Array>} Array de películas populares
 */
async function fetchPopularMovies() {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Películas populares cargadas:', data.results.length);
        return data.results;
    } catch (error) {
        console.error('❌ Error fetching popular movies:', error);
        return [];
    }
}

/**
 * Obtiene películas por género
 * @param {number} genreId - ID del género
 * @returns {Promise<Array>} Array de películas del género
 */
async function fetchMoviesByGenre(genreId) {
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Películas del género ${genreId} cargadas:`, data.results.length);
        return data.results;
    } catch (error) {
        console.error(`❌ Error fetching movies by genre ${genreId}:`, error);
        return [];
    }
}

// ============================================
// FUNCIONES DE WATCHMODE (Streaming Providers)
// ============================================

/**
 * Obtiene los servicios de streaming donde está disponible una película
 * @param {number} movieId - ID de TMDB de la película
 * @returns {Promise<Array>} Array de servicios de streaming
 */
async function getStreamingProviders(movieId) {
    if (!movieId) {
        console.error('❌ No movie ID provided for streaming providers');
        return [];
    }

    try {
        // Paso 1: Buscar el título en Watchmode usando el ID de TMDB
        const searchUrl = `${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=id_tmdb&search_value=${movieId}`;

        console.log(`🔍 Buscando streaming para movie ID: ${movieId}`);

        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
            console.warn(`⚠️ Watchmode search failed with status: ${searchResponse.status}`);
            return [];
        }

        const searchData = await searchResponse.json();

        // Verificar si encontramos el título en Watchmode
        if (searchData.title_results && searchData.title_results.length > 0) {
            const watchmodeId = searchData.title_results[0].id;

            // Paso 2: Obtener las fuentes (servicios de streaming)
            const sourcesUrl = `${WATCHMODE_BASE_URL}/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
            const sourcesResponse = await fetch(sourcesUrl);

            if (!sourcesResponse.ok) {
                console.warn(`⚠️ Watchmode sources failed with status: ${sourcesResponse.status}`);
                return [];
            }

            const sources = await sourcesResponse.json();

            // Filtrar solo servicios de streaming (subscription) y limitar a 5
            // 'sub' = subscription (Netflix, Prime, etc.)
            // 'rent' = alquiler, 'buy' = compra
            const streamingServices = sources
                .filter(source => source.type === 'sub')
                .slice(0, 5);

            console.log(`✅ Encontrados ${streamingServices.length} servicios de streaming para movie ID ${movieId}`);
            return streamingServices;
        }

        console.log(`ℹ️ No se encontraron servicios de streaming para movie ID ${movieId}`);
        return [];

    } catch (error) {
        console.error(`❌ Error fetching streaming providers for movie ${movieId}:`, error);
        return [];
    }
}

/**
 * Obtiene servicios de streaming incluyendo alquiler/compra (opcional)
 * @param {number} movieId - ID de TMDB de la película
 * @returns {Promise<Array>} Array de todos los servicios disponibles
 */
async function getAllProviders(movieId) {
    if (!movieId) {
        return [];
    }

    try {
        const searchUrl = `${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=id_tmdb&search_value=${movieId}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.title_results && searchData.title_results.length > 0) {
            const watchmodeId = searchData.title_results[0].id;
            const sourcesUrl = `${WATCHMODE_BASE_URL}/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
            const sourcesResponse = await fetch(sourcesUrl);
            const sources = await sourcesResponse.json();

            // Incluir todos los tipos (subscription, rent, buy)
            return sources.slice(0, 10);
        }
        return [];

    } catch (error) {
        console.error(`Error fetching all providers for movie ${movieId}:`, error);
        return [];
    }
}

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

/**
 * Obtiene la lista de géneros de películas
 * @returns {Promise<Array>} Array de géneros
 */
async function fetchGenres() {
    const url = `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Géneros cargados:', data.genres.length);
        return data.genres;
    } catch (error) {
        console.error('❌ Error fetching genres:', error);
        return [];
    }
}

// ============================================
// EXPORTACIONES
// ============================================

export {
    // TMDB
    fetchTrendingMovies,
    searchMovies,
    fetchMovieDetails,
    fetchPopularMovies,
    fetchMoviesByGenre,
    fetchGenres,

    // Watchmode
    getStreamingProviders,
    getAllProviders
};