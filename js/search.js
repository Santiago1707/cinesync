// js/search.js - CORREGIDO
import { searchMovies } from './api.js';
import { displayMovies } from './ui.js';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const globalSearch = document.getElementById('global-search'); // Puede ser null
const resultsContainer = document.getElementById('search-results');

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
if (searchBtn) {
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });
}

// ⚠️ IMPORTANTE: Verificar si globalSearch existe antes de usarlo
if (globalSearch) {
    globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && globalSearch.value.trim() !== '') {
            window.location.href = `search.html?q=${encodeURIComponent(globalSearch.value)}`;
        }
    });
}

const urlParams = new URLSearchParams(window.location.search);
const queryParam = urlParams.get('q');
if (queryParam) {
    searchInput.value = queryParam;
    performSearch(queryParam);
}