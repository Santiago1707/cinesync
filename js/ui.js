// js/ui.js

/**
 * Crea el HTML para una tarjeta de película
 * @param {Object} movie - Datos de la película de TMDB
 * @returns {string} HTML de la tarjeta
 */
function createMovieCard(movie) {
    // Verificar si la película tiene poster (imagen)
    // movie.poster_path viene de la API, si es null no hay imagen
    const hasPoster = movie.poster_path !== null && movie.poster_path !== undefined;

    let posterHTML;

    if (hasPoster) {
        // CASO 1: SÍ hay poster - mostrar la imagen de TMDB
        const posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        posterHTML = `<img src="${posterPath}" alt="${movie.title}" loading="lazy">`;
    } else {
        // CASO 2: NO hay poster - mostrar placeholder de color con el título
        posterHTML = `
            <div class="no-poster-placeholder">
                🎬 ${movie.title}
            </div>
        `;
    }

    // Título truncado si es muy largo (más de 25 caracteres)
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
 * Muestra películas en un contenedor
 * @param {Array} movies - Array de películas
 * @param {string} containerId - ID del contenedor (ej. 'trending-movies-container')
 */
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">No movies found</p>';
        return;
    }

    // Convertir cada película a HTML y unirlas
    const moviesHTML = movies.map(createMovieCard).join('');
    container.innerHTML = moviesHTML;
}

// Exportar funciones para usar en otros archivos
export { displayMovies, createMovieCard };