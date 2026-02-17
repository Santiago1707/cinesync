// js/search.js
import { searchMovies } from './api.js';
import { displayMovies } from './ui.js';

// Elementos del DOM
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const globalSearch = document.getElementById('global-search');
const resultsContainer = document.getElementById('search-results');

// Función para realizar búsqueda
async function performSearch(query) {
    if (!query || query.trim() === '') {
        resultsContainer.innerHTML = '<p class="search-hint">🔍 Type something and click Search</p>';
        return;
    }

    try {
        resultsContainer.innerHTML = '<p class="loading">Searching for movies... 🎬</p>';

        const results = await searchMovies(query);

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No movies found. Try another title!</p>';
        } else {
            await displayMovies(results, 'search-results');
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<p class="error">Something went wrong. Try again.</p>';
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

// Búsqueda global (header)
globalSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && globalSearch.value.trim() !== '') {
        window.location.href = `search.html?q=${encodeURIComponent(globalSearch.value)}`;
    }
});

// Cargar búsqueda desde URL (si viene de global search)
const urlParams = new URLSearchParams(window.location.search);
const queryParam = urlParams.get('q');
if (queryParam) {
    searchInput.value = queryParam;
    performSearch(queryParam);
}