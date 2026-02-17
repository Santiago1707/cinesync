// js/watchlist.js
// Módulo para manejar la lista de películas del usuario

// Clave para localStorage
const STORAGE_KEY = 'cinesync_watchlist';

/**
 * Obtiene la watchlist del localStorage
 * @returns {Array} Array de películas guardadas
 */
function getWatchlist() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Guarda la watchlist en localStorage
 * @param {Array} watchlist - Array de películas
 */
function saveWatchlist(watchlist) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
}

/**
 * Agrega una película a la watchlist
 * @param {Object} movie - Película a agregar
 * @returns {boolean} - true si se agregó, false si ya existía
 */
function addToWatchlist(movie) {
    const watchlist = getWatchlist();

    // Verificar si ya existe
    const exists = watchlist.some(m => m.id === movie.id);

    if (!exists) {
        // Crear objeto simplificado para guardar
        const movieToSave = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            date_added: new Date().toISOString()
        };

        watchlist.push(movieToSave);
        saveWatchlist(watchlist);
        return true;
    }
    return false;
}

/**
 * Elimina una película de la watchlist
 * @param {number} movieId - ID de la película
 * @returns {boolean} - true si se eliminó
 */
function removeFromWatchlist(movieId) {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(m => m.id !== movieId);

    if (filtered.length !== watchlist.length) {
        saveWatchlist(filtered);
        return true;
    }
    return false;
}

/**
 * Verifica si una película está en la watchlist
 * @param {number} movieId - ID de la película
 * @returns {boolean}
 */
function isInWatchlist(movieId) {
    const watchlist = getWatchlist();
    return watchlist.some(m => m.id === movieId);
}

// Exportar funciones
export {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
};