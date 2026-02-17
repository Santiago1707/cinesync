// js/main.js
// Punto de entrada principal de la aplicación
// Importa funciones necesarias de otros módulos
import { fetchTrendingMovies } from './api.js';
import { displayMovies } from './ui.js';

/**
 * Inicializa la página principal
 * Carga las películas en tendencia y las muestra
 */
async function initHomePage() {
    try {
        // Mostrar mensaje de carga mientras se obtienen los datos
        const container = document.getElementById('trending-movies-container');
        container.innerHTML = '<p class="loading">Loading amazing movies... 🎬</p>';

        // Obtener películas de la API
        const movies = await fetchTrendingMovies();

        // Mostrar las películas en la página (esto también carga los íconos de streaming)
        await displayMovies(movies, 'trending-movies-container');

    } catch (error) {
        // Manejar errores
        console.error('Error loading home page:', error);
        const container = document.getElementById('trending-movies-container');
        container.innerHTML = '<p class="error">Oops! Something went wrong. Please try again.</p>';
    }
}

// Esperar a que el DOM esté completamente cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', initHomePage);

// Exportar algo si es necesario (opcional)
export { initHomePage };