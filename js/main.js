// js/main.js
import { fetchTrendingMovies } from './api.js';

async function initHomePage() {
    const movies = await fetchTrendingMovies();
    // Por ahora, solo lo mostramos en consola
    console.log('Películas cargadas para la página de inicio:', movies);
    // ¡En el siguiente paso las pondremos en la página!
}

// Ejecuta la función cuando la página cargue
document.addEventListener('DOMContentLoaded', initHomePage);