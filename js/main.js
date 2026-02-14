// js/main.js
import { fetchTrendingMovies } from './api.js';
import { displayMovies } from './ui.js';

async function initHomePage() {
    try {
        // Mostrar loader
        const container = document.getElementById('trending-movies-container');
        container.innerHTML = '<p class="loading">Loading amazing movies... 🎬</p>';

        // Obtener películas
        const movies = await fetchTrendingMovies();

        // Mostrar películas en la página
        displayMovies(movies, 'trending-movies-container');

    } catch (error) {
        console.error('Error loading home page:', error);
        const container = document.getElementById('trending-movies-container');
        container.innerHTML = '<p class="error">Oops! Something went wrong. Please try again.</p>';
    }
}

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', initHomePage);