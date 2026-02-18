// js/ui.js
// Módulo para mostrar películas en la interfaz de usuario

import { getStreamingProviders } from './api.js';

/**
 * Crea el HTML para una tarjeta de película
 * @param {Object} movie - Datos de la película de TMDB
 * @param {boolean} showAddButton - Si debe mostrar el botón "Add to List"
 * @returns {string} HTML de la tarjeta
 */
function createMovieCard(movie, showAddButton = true) {
    // Verificar si la película tiene poster
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
    const title = movie.title?.length > 25
        ? movie.title.substring(0, 25) + '...'
        : movie.title || 'Unknown Title';

    // Año de estreno
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    // Calificación
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    // Botón Add to List (solo si showAddButton es true)
    const addButtonHTML = showAddButton
        ? `<div class="movie-actions">
                <button class="btn-add" data-id="${movie.id}" data-title="${movie.title}">
                    + Add to List
                </button>
            </div>`
        : '';

    return `
        <div class="movie-card" data-id="${movie.id}" onclick="window.location.href='movie.html?id=${movie.id}'">
            ${posterHTML}
            <div class="movie-info">
                <h3 class="movie-title">${title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${year}</span>
                    <span class="movie-rating">⭐ ${rating}</span>
                </div>
                <div class="streaming-icons" id="streaming-${movie.id}">
                    <span class="loading-icons">⌛</span>
                </div>
                ${addButtonHTML}
            </div>
        </div>
    `;
}

/**
 * Carga los íconos de streaming para cada película
 * @param {Array} movies - Array de películas
 */
async function loadStreamingIcons(movies) {
    if (!movies || movies.length === 0) return;

    const promises = movies.map(async (movie) => {
        try {
            const providers = await getStreamingProviders(movie.id);
            const iconsContainer = document.getElementById(`streaming-${movie.id}`);

            if (iconsContainer) {
                if (providers && providers.length > 0) {
                    iconsContainer.innerHTML = providers.slice(0, 3).map(provider => {
                        const logoUrl = provider.image_url || `https://via.placeholder.com/25/0f1b2f/f5c518?text=${provider.name?.charAt(0) || '?'}`;
                        return `
                            <img src="${logoUrl}" 
                                 alt="${provider.name || 'Streaming'}" 
                                 class="streaming-icon"
                                 title="${provider.name || 'Available'}"
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/25/0f1b2f/f5c518?text=📺'">
                        `;
                    }).join('');
                } else {
                    iconsContainer.innerHTML = '<span class="no-streaming" title="Streaming info not available with free plan">📺</span>';
                }
            }
        } catch (error) {
            console.log(`Streaming info not available for movie ${movie.id}`);
            const iconsContainer = document.getElementById(`streaming-${movie.id}`);
            if (iconsContainer) {
                iconsContainer.innerHTML = '<span class="no-streaming">📺</span>';
            }
        }
    });

    await Promise.allSettled(promises);
}

/**
 * Configura los botones "Add to List"
 */
function setupAddButtons() {
    document.querySelectorAll('.btn-add').forEach(button => {
        // Remover listeners anteriores para evitar duplicados
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', async (event) => {
            event.stopPropagation();

            const movieId = newButton.dataset.id;
            const movieTitle = newButton.dataset.title;

            try {
                const { addToWatchlist } = await import('./watchlist.js');

                const movie = {
                    id: parseInt(movieId),
                    title: movieTitle,
                    poster_path: null,
                    date_added: new Date().toISOString()
                };

                if (addToWatchlist(movie)) {
                    const originalText = newButton.textContent;
                    newButton.textContent = '✓ Added!';
                    newButton.style.backgroundColor = '#28a745';

                    setTimeout(() => {
                        newButton.textContent = originalText;
                        newButton.style.backgroundColor = '';
                    }, 1500);
                } else {
                    newButton.textContent = 'Already in list';
                    newButton.style.backgroundColor = '#6c757d';

                    setTimeout(() => {
                        newButton.textContent = '+ Add to List';
                        newButton.style.backgroundColor = '';
                    }, 1500);
                }
            } catch (error) {
                console.error('Error adding to watchlist:', error);
                newButton.textContent = 'Error!';
                newButton.style.backgroundColor = '#dc3545';

                setTimeout(() => {
                    newButton.textContent = '+ Add to List';
                    newButton.style.backgroundColor = '';
                }, 1500);
            }
        });
    });
}

/**
 * Muestra películas en un contenedor
 * @param {Array} movies - Array de películas
 * @param {string} containerId - ID del contenedor
 * @param {Object} options - Opciones adicionales
 */
async function displayMovies(movies, containerId, options = { showAddButton: true }) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found</p>';
        return;
    }

    // Guardar la posición del scroll
    const scrollPosition = window.scrollY;

    // Mostrar las tarjetas
    const moviesHTML = movies.map(movie => createMovieCard(movie, options.showAddButton)).join('');
    container.innerHTML = moviesHTML;

    // Cargar íconos de streaming
    await loadStreamingIcons(movies);

    // Configurar botones SOLO si showAddButton es true
    if (options.showAddButton) {
        setupAddButtons();
    }

    // Restaurar scroll
    window.scrollTo(0, scrollPosition);
}

// Exportar funciones
export { displayMovies, createMovieCard, loadStreamingIcons, setupAddButtons };