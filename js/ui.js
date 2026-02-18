// js/ui.js
// Módulo para mostrar películas en la interfaz de usuario

import { getStreamingProviders } from './api.js';

/**
 * Crea el HTML para una tarjeta de película
 * @param {Object} movie - Datos de la película
 * @param {boolean} showAddButton - Si debe mostrar botón "Add to List"
 * @param {boolean} showRemoveButton - Si debe mostrar botón "Remove"
 * @returns {string} HTML de la tarjeta
 */
function createMovieCard(movie, showAddButton = true, showRemoveButton = false) {
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

    const title = movie.title?.length > 25
        ? movie.title.substring(0, 25) + '...'
        : movie.title || 'Unknown Title';

    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    // Botones
    let buttonsHTML = '';

    if (showAddButton) {
        buttonsHTML += `
            <div class="movie-actions">
                <button class="btn-add" data-id="${movie.id}" data-title="${movie.title}">
                    + Add to List
                </button>
            </div>
        `;
    }

    if (showRemoveButton) {
        buttonsHTML += `
            <div class="movie-actions">
                <button class="btn-remove" data-id="${movie.id}" data-title="${movie.title}">
                    ✕ Remove
                </button>
            </div>
        `;
    }

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
                ${buttonsHTML}
            </div>
        </div>
    `;
}

/**
 * Carga los íconos de streaming para cada película
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
                    iconsContainer.innerHTML = '<span class="no-streaming" title="Streaming info not available">📺</span>';
                }
            }
        } catch (error) {
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
                    poster_path: null
                };

                if (addToWatchlist(movie)) {
                    newButton.textContent = '✓ Added!';
                    newButton.style.backgroundColor = '#28a745';

                    setTimeout(() => {
                        newButton.textContent = '+ Add to List';
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
                console.error('Error:', error);
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
 */
export async function displayMovies(movies, containerId, options = { showAddButton: true, showRemoveButton: false }) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found</p>';
        return;
    }

    const scrollPosition = window.scrollY;

    // Mostrar tarjetas con opciones
    const moviesHTML = movies.map(movie =>
        createMovieCard(movie, options.showAddButton, options.showRemoveButton)
    ).join('');

    container.innerHTML = moviesHTML;

    await loadStreamingIcons(movies);

    if (options.showAddButton) {
        setupAddButtons();
    }

    window.scrollTo(0, scrollPosition);
}

export { createMovieCard, loadStreamingIcons };