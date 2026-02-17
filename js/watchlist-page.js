// js/watchlist-page.js
import { getWatchlist } from './watchlist.js';
import { displayMovies } from './ui.js';
import { fetchMovieDetails } from './api.js'; // Necesitarás agregar esta función a api.js

/**
 * Carga y muestra la watchlist del usuario
 */
async function loadWatchlistPage() {
    const container = document.getElementById('watchlist-container');

    // Obtener watchlist del localStorage
    const watchlist = getWatchlist();

    if (watchlist.length === 0) {
        container.innerHTML = '<p class="no-results">Your watchlist is empty. Start adding movies! 🎬</p>';
        return;
    }

    // Mostrar mensaje de carga
    container.innerHTML = '<p class="loading">Loading your movies...</p>';

    // Obtener detalles actualizados de cada película (opcional)
    const moviesWithDetails = await Promise.all(
        watchlist.map(async (movie) => {
            try {
                const details = await fetchMovieDetails(movie.id);
                return details;
            } catch {
                return movie; // Si falla, usar datos guardados
            }
        })
    );

    // Mostrar películas
    await displayMovies(moviesWithDetails, 'watchlist-container');
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', loadWatchlistPage);