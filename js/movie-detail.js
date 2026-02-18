// js/movie-detail.js
import { fetchMovieDetails, getStreamingProviders } from './api.js';
import { addToWatchlist, isInWatchlist } from './watchlist.js';

// Obtener ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (!movieId) {
    window.location.href = 'index.html';
}

const container = document.getElementById('movie-detail-container');

/**
 * Carga los detalles de la película
 */
async function loadMovieDetails() {
    try {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div class="spinner"></div>
                <p class="loading">Loading movie details... 🎬</p>
            </div>
        `;

        const [movie, providers] = await Promise.all([
            fetchMovieDetails(movieId),
            getStreamingProviders(movieId)
        ]);

        if (!movie) {
            throw new Error('Movie not found');
        }

        renderMovieDetails(movie, providers);

    } catch (error) {
        console.error('Error loading movie details:', error);
        container.innerHTML = `
            <div class="error">
                <p>Error loading movie details</p>
                <button onclick="history.back()" style="margin-top: 1rem; padding: 0.5rem 2rem; background: #f5c518; border: none; border-radius: 5px; cursor: pointer;">
                    Go Back
                </button>
            </div>
        `;
    }
}

/**
 * Renderiza los detalles de la película
 */
function renderMovieDetails(movie, providers) {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750/0f1b2f/f5c518?text=No+Poster';

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
    const inWatchlist = isInWatchlist(movie.id);

    // Géneros
    const genresHTML = movie.genres?.map(g =>
        `<span class="genre-tag">${g.name}</span>`
    ).join('') || '<span class="genre-tag">N/A</span>';

    // Streaming providers
    const providersHTML = providers.length > 0
        ? providers.map(p => `
            <div class="streaming-provider">
                <img src="${p.image_url || 'https://via.placeholder.com/50/0f1b2f/f5c518?text=' + (p.name?.charAt(0) || '?')}" 
                     alt="${p.name || 'Streaming'}"
                     onerror="this.src='https://via.placeholder.com/50/0f1b2f/f5c518?text=📺'">
                <span>${p.name || 'Available'}</span>
            </div>
        `).join('')
        : '<p>Streaming info not available with free plan 📺</p>';

    // Cast
    const castHTML = movie.credits?.cast?.slice(0, 8).map(actor => `
        <div class="cast-member">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/100/0f1b2f/f5c518?text=🎭'}" 
                 alt="${actor.name}"
                 onerror="this.src='https://via.placeholder.com/100/0f1b2f/f5c518?text=🎭'">
            <div class="cast-name">${actor.name}</div>
            <div class="cast-character">${actor.character || ''}</div>
        </div>
    `).join('') || '<p>No cast information available</p>';

    const html = `
        <div class="movie-detail fade-in">
            <button class="back-button" onclick="history.back()">← Back</button>
            
            <div class="movie-header">
                <div class="movie-poster">
                    <img src="${posterUrl}" alt="${movie.title}">
                </div>
                
                <div class="movie-info-detailed">
                    <h2>${movie.title}</h2>
                    <div class="movie-year-runtime">${year} • ${runtime}</div>
                    <div class="movie-rating-detailed">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}/10</div>
                    
                    <div class="movie-genres">${genresHTML}</div>
                    
                    <div class="movie-actions-detailed">
                        <button class="watchlist-btn" id="watchlist-btn" data-id="${movie.id}">
                            ${inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                        </button>
                    </div>
                    
                    <div class="streaming-section">
                        <h3>Where to Watch</h3>
                        <div class="streaming-providers">
                            ${providersHTML}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="movie-plot">
                <h3>Synopsis</h3>
                <p>${movie.overview || 'No synopsis available.'}</p>
            </div>
            
            <div class="movie-cast">
                <h3>Cast</h3>
                <div class="cast-grid">${castHTML}</div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Configurar botón de watchlist
    const watchlistBtn = document.getElementById('watchlist-btn');
    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', () => {
            const movieSimple = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            };

            if (addToWatchlist(movieSimple)) {
                watchlistBtn.textContent = '✓ In Watchlist';
                watchlistBtn.style.backgroundColor = '#28a745';
            } else {
                alert('Movie already in watchlist!');
            }
        });
    }
}

// Iniciar
document.addEventListener('DOMContentLoaded', loadMovieDetails);