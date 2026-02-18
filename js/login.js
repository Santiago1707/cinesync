// js/login.js
import { loginUser, createDemoUser, getCurrentUser } from './auth.js';

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheck = document.getElementById('remember');
const loginBtn = document.getElementById('login-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Verificar si ya hay sesión activa
const currentUser = getCurrentUser();
if (currentUser) {
    // Redirigir al home si ya está logueado
    window.location.href = 'index.html';
}

// Crear usuario demo al cargar la página
createDemoUser();

/**
 * Muestra un mensaje de alerta
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta (success, error, info)
 */
function showAlert(message, type = 'error') {
    // Eliminar alertas anteriores
    const oldAlert = document.querySelector('.alert');
    if (oldAlert) {
        oldAlert.remove();
    }

    // Crear nueva alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} slide-down`;
    alert.textContent = message;

    // Insertar al inicio del formulario
    loginForm.insertBefore(alert, loginForm.firstChild);

    // Auto-eliminar después de 3 segundos (solo para success)
    if (type === 'success') {
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

/**
 * Valida el formulario de login
 * @returns {boolean} - true si es válido
 */
function validateForm() {
    let isValid = true;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Resetear estilos de error
    [emailInput, passwordInput].forEach(input => {
        input.classList.remove('error');
    });

    // Validar email
    if (!email) {
        emailInput.classList.add('error');
        showAlert('Email is required');
        isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
        emailInput.classList.add('error');
        showAlert('Please enter a valid email address');
        isValid = false;
    }

    // Validar password
    if (!password) {
        passwordInput.classList.add('error');
        showAlert('Password is required');
        isValid = false;
    }

    return isValid;
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento del formulario
 */
async function handleLogin(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Mostrar loader
    loginBtn.disabled = true;
    btnText.textContent = 'Logging in...';
    btnLoader.style.display = 'inline-block';

    // Pequeño delay para mostrar el loader (simulación)
    await new Promise(resolve => setTimeout(resolve, 500));

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Intentar login
    const result = loginUser(email, password);

    if (result.success) {
        showAlert('Login successful! Redirecting...', 'success');

        // Guardar en localStorage si "remember me" está marcado
        if (rememberCheck && rememberCheck.checked) {
            localStorage.setItem('remembered_email', email);
        } else {
            localStorage.removeItem('remembered_email');
        }

        // Redirigir al home después de 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showAlert(result.message);

        // Restaurar botón
        loginBtn.disabled = false;
        btnText.textContent = 'Login';
        btnLoader.style.display = 'none';

        // Agregar animación de shake al formulario
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }
}

/**
 * Carga el email guardado si existe
 */
function loadSavedEmail() {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (rememberCheck) {
            rememberCheck.checked = true;
        }
    }
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

// Cargar email guardado
loadSavedEmail();

// Auto-completar demo credentials (opcional, para desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // En desarrollo, auto-completar con credenciales demo
    setTimeout(() => {
        if (!emailInput.value) {
            emailInput.value = 'demo@cinesync.com';
            passwordInput.value = 'demo123';
        }
    }, 500);
}

// Limpiar mensajes al escribir
[emailInput, passwordInput].forEach(input => {
    if (input) {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const alert = document.querySelector('.alert');
            if (alert && alert.classList.contains('alert-error')) {
                alert.remove();
            }
        });
    }
});