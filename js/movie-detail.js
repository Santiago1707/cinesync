// js/movie-detail.js
import { fetchMovieDetails, getStreamingProviders } from './api.js';
import { addToWatchlist, isInWatchlist } from './watchlist.js';

// Obtener ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (!movieId) {
    window.location.href = 'index.html';
}

// Elementos del DOM
const container = document.getElementById('movie-detail-container');

// Cargar detalles
async function loadMovieDetails() {
    try {
        container.innerHTML = '<div class="loading">Loading movie details... 🎬</div>';

        const movie = await fetchMovieDetails(movieId);
        const providers = await getStreamingProviders(movieId);

        renderMovieDetails(movie, providers);

    } catch (error) {
        console.error('Error loading movie details:', error);
        container.innerHTML = '<div class="error">Error loading movie details</div>';
    }
}

// Renderizar detalles
function renderMovieDetails(movie, providers) {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'assets/no-poster.jpg';

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';

    // Verificar si está en watchlist
    const inWatchlist = isInWatchlist(movie.id);

    const genresHTML = movie.genres.map(g =>
        `<span class="genre-tag">${g.name}</span>`
    ).join('');

    const providersHTML = providers.length > 0
        ? providers.map(p => `
            <div class="streaming-provider">
                <img src="${p.image_url || 'https://via.placeholder.com/50'}" alt="${p.name}">
                <span>${p.name}</span>
            </div>
        `).join('')
        : '<p>Streaming info not available with free plan 📺</p>';

    const castHTML = movie.credits?.cast?.slice(0, 6).map(actor => `
        <div class="cast-member">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/100'}" alt="${actor.name}">
            <div class="cast-name">${actor.name}</div>
            <div class="cast-character">${actor.character}</div>
        </div>
    `).join('') || '<p>No cast information available</p>';

    const html = `
        <div class="movie-detail">
            <button class="back-button" onclick="history.back()">← Back</button>
            
            <div class="movie-header">
                <div class="movie-poster">
                    <img src="${posterUrl}" alt="${movie.title}">
                </div>
                
                <div class="movie-info-detailed">
                    <h2>${movie.title}</h2>
                    <div class="movie-year-runtime">${year} • ${runtime}</div>
                    <div class="movie-rating-detailed">⭐ ${movie.vote_average?.toFixed(1)}/10</div>
                    
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
            } else {
                alert('Movie already in watchlist!');
            }
        });
    }
}

// Iniciar
document.addEventListener('DOMContentLoaded', loadMovieDetails);