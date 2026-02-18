// js/main.js
// Punto de entrada principal para la página de inicio

import { fetchTrendingMovies } from './api.js';
import { displayMovies } from './ui.js';

/**
 * Inicializa la página principal
 * Carga las películas en tendencia y las muestra
 */
async function initHomePage() {
    try {
        const container = document.getElementById('trending-movies-container');

        if (!container) {
            console.error('Container not found');
            return;
        }

        // Mostrar spinner de carga
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div class="spinner"></div>
                <p class="loading">Loading amazing movies... 🎬</p>
            </div>
        `;

        // Obtener películas de la API
        const movies = await fetchTrendingMovies();

        // Verificar que hay películas
        if (!movies || movies.length === 0) {
            container.innerHTML = '<p class="error">No movies found. Please try again later.</p>';
            return;
        }

        // Mostrar las películas
        await displayMovies(movies, 'trending-movies-container');

        console.log(`✅ Homepage loaded with ${movies.length} movies`);

    } catch (error) {
        console.error('❌ Error loading home page:', error);
        const container = document.getElementById('trending-movies-container');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    <p>Oops! Something went wrong.</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem;">${error.message}</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 2rem; background: #f5c518; border: none; border-radius: 5px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initHomePage);

export { initHomePage };