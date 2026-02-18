// js/watchlist.js
// Módulo para manejar la lista de películas del usuario

const STORAGE_KEY = 'cinesync_watchlist';

/**
 * Obtiene la watchlist del localStorage
 * @returns {Array} Array de películas guardadas
 */
export function getWatchlist() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading watchlist:', error);
        return [];
    }
}

/**
 * Guarda la watchlist en localStorage
 * @param {Array} watchlist - Array de películas
 */
export function saveWatchlist(watchlist) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
        console.error('Error saving watchlist:', error);
    }
}

/**
 * Agrega una película a la watchlist
 * @param {Object} movie - Película a agregar
 * @returns {boolean} - true si se agregó, false si ya existía
 */
export function addToWatchlist(movie) {
    if (!movie || !movie.id) return false;

    const watchlist = getWatchlist();
    const exists = watchlist.some(m => m.id === movie.id);

    if (!exists) {
        const movieToSave = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path || null,
            release_date: movie.release_date || null,
            vote_average: movie.vote_average || 0,
            date_added: new Date().toISOString()
        };

        watchlist.push(movieToSave);
        saveWatchlist(watchlist);

        // Disparar evento para actualizar otras pestañas
        window.dispatchEvent(new Event('watchlistUpdated'));

        return true;
    }
    return false;
}

/**
 * Elimina una película de la watchlist (INDIVIDUAL)
 * @param {number} movieId - ID de la película
 * @returns {boolean} - true si se eliminó
 */
export function removeFromWatchlist(movieId) {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(m => m.id !== movieId);

    if (filtered.length !== watchlist.length) {
        saveWatchlist(filtered);

        // Disparar evento para actualizar otras pestañas
        window.dispatchEvent(new Event('watchlistUpdated'));

        return true;
    }
    return false;
}

/**
 * Verifica si una película está en la watchlist
 * @param {number} movieId - ID de la película
 * @returns {boolean}
 */
export function isInWatchlist(movieId) {
    const watchlist = getWatchlist();
    return watchlist.some(m => m.id === movieId);
}

/**
 * Limpia toda la watchlist
 * @returns {boolean}
 */
export function clearWatchlist() {
    localStorage.removeItem(STORAGE_KEY);

    // Disparar evento para actualizar otras pestañas
    window.dispatchEvent(new Event('watchlistUpdated'));

    return true;
}