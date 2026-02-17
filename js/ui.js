// js/ui.js
import { getStreamingProviders } from './api.js';

/**
 * Crea el HTML para una tarjeta de película
 * @param {Object} movie - Datos de la película de TMDB
 * @returns {string} HTML de la tarjeta
 */
function createMovieCard(movie) {
    // Verificar si la película tiene poster (imagen)
    const hasPoster = movie.poster_path !== null && movie.poster_path !== undefined;

    let posterHTML;

    if (hasPoster) {
        const posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        posterHTML = `<img src="${posterPath}" alt="${movie.title}" loading="lazy">`;
    } else {
        posterHTML = `
            <div class="no-poster-placeholder">
                🎬 ${movie.title}
            </div>
        `;
    }

    // Título truncado si es muy largo
    const title = movie.title.length > 25
        ? movie.title.substring(0, 25) + '...'
        : movie.title;

    // Año de estreno (si existe)
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    // Calificación (si existe)
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    // Devolver el HTML completo de la tarjeta
    return `
        <div class="movie-card" data-id="${movie.id}">
            ${posterHTML}
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${year}</span>
                    <span class="movie-rating">⭐ ${rating}</span>
                </div>
                <div class="streaming-icons" id="streaming-${movie.id}">
                    <!-- Los íconos se cargarán después -->
                    <span class="loading-icons">⌛</span>
                </div>
                <div class="movie-actions">
                    <button class="btn-add" data-id="${movie.id}" data-title="${movie.title}">
                        + Add to List
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Carga los íconos de streaming para cada película
 * @param {Array} movies - Array de películas
 */
async function loadStreamingIcons(movies) {
    for (const movie of movies) {
        try {
            const providers = await getStreamingProviders(movie.id);
            const iconsContainer = document.getElementById(`streaming-${movie.id}`);

            if (iconsContainer) {
                if (providers && providers.length > 0) {
                    // Mostrar íconos de los primeros 3 providers
                    iconsContainer.innerHTML = providers.slice(0, 3).map(provider => {
                        // Usar el logo de Watchmode o un placeholder
                        const logoUrl = provider.image_url || `https://via.placeholder.com/30/0f1b2f/f5c518?text=${provider.name.charAt(0)}`;
                        return `
                            <img src="${logoUrl}" 
                                 alt="${provider.name}" 
                                 class="streaming-icon"
                                 title="${provider.name}">
                        `;
                    }).join('');
                } else {
                    // No hay providers disponibles
                    iconsContainer.innerHTML = '<span class="no-streaming">📺</span>';
                }
            }
        } catch (error) {
            console.error(`Error loading streaming icons for movie ${movie.id}:`, error);
            const iconsContainer = document.getElementById(`streaming-${movie.id}`);
            if (iconsContainer) {
                iconsContainer.innerHTML = '<span class="no-streaming">❌</span>';
            }
        }
    }
}

/**
 * Muestra películas en un contenedor
 * @param {Array} movies - Array de películas
 * @param {string} containerId - ID del contenedor
 */
async function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found</p>';
        return;
    }

    // Mostrar las tarjetas primero
    const moviesHTML = movies.map(movie => createMovieCard(movie)).join('');
    container.innerHTML = moviesHTML;

    // Luego cargar los íconos de streaming
    await loadStreamingIcons(movies);
}

// Exportar funciones
export { displayMovies, createMovieCard, loadStreamingIcons };