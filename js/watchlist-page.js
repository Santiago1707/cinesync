// js/watchlist-page.js
import { getWatchlist, removeFromWatchlist, clearWatchlist } from './watchlist.js';
import { displayMovies } from './ui.js';
import { fetchMovieDetails } from './api.js';
import { updateUIForUser } from './logout.js';

/**
 * Carga y muestra la watchlist del usuario
 */
async function loadWatchlistPage() {
    const container = document.getElementById('watchlist-container');
    const clearBtn = document.getElementById('clear-watchlist-btn');

    if (!container) return;

    try {
        // Actualizar UI de usuario
        updateUIForUser();

        // Obtener watchlist del localStorage
        const watchlist = getWatchlist();

        if (watchlist.length === 0) {
            container.innerHTML = '<p class="no-results">Your watchlist is empty. Start adding movies! 🎬</p>';
            return;
        }

        // Mostrar mensaje de carga
        container.innerHTML = '<p class="loading">Loading your movies...</p>';

        // Obtener detalles actualizados de cada película
        const moviesWithDetails = await Promise.all(
            watchlist.map(async (movie) => {
                try {
                    const details = await fetchMovieDetails(movie.id);
                    return details || movie;
                } catch {
                    return movie;
                }
            })
        );

        // Filtrar resultados nulos
        const validMovies = moviesWithDetails.filter(m => m !== null);

        // Mostrar películas SIN el botón "Add to List"
        await displayMovies(validMovies, 'watchlist-container', {
            showAddButton: false,
            showRemoveButton: true // NUEVA OPCIÓN
        });

        // Configurar botón Clear All
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm('Are you sure you want to clear your entire watchlist?')) {
                    clearWatchlist();
                    loadWatchlistPage();
                }
            };
        }

        // Configurar botones Remove individual
        setupRemoveButtons();

    } catch (error) {
        console.error('Error loading watchlist:', error);
        container.innerHTML = '<p class="error">Error loading your watchlist</p>';
    }
}

/**
 * Configura los botones de Remove individual
 */
function setupRemoveButtons() {
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            const movieId = parseInt(button.dataset.id);
            const movieTitle = button.dataset.title;

            if (confirm(`Remove "${movieTitle}" from your watchlist?`)) {
                const removed = removeFromWatchlist(movieId);
                if (removed) {
                    // Recargar la página
                    loadWatchlistPage();
                }
            }
        });
    });
}

// Escuchar cambios en localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'cinesync_watchlist') {
        loadWatchlistPage();
    }
});

// Escuchar evento personalizado
window.addEventListener('watchlistUpdated', () => {
    loadWatchlistPage();
});

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', loadWatchlistPage);