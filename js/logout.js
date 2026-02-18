// js/logout.js
// Módulo para manejar el logout en todas las páginas

import { logoutUser, getCurrentUser, getCurrentUserName } from './auth.js';

/**
 * Actualiza la interfaz de usuario según el estado de login
 */
export function updateUIForUser() {
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUser = getCurrentUser();

    if (userInfo) {
        if (currentUser) {
            userInfo.innerHTML = `👤 <span>${currentUser.name}</span>`;
        } else {
            userInfo.innerHTML = '👤 <span>Guest</span>';
        }
    }

    if (logoutBtn) {
        if (currentUser) {
            logoutBtn.style.display = 'inline-block';
        } else {
            logoutBtn.style.display = 'none';
        }
    }
}

/**
 * Configura el botón de logout
 */
export function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const result = logoutUser();
            if (result.success) {
                updateUIForUser();
                window.location.href = 'index.html';
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    updateUIForUser();
    setupLogoutButton();
});