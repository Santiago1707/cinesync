// js/register.js
import { registerUser } from './auth.js';

// Elementos del DOM
const registerForm = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const termsCheck = document.getElementById('terms');
const registerBtn = document.getElementById('register-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

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
    registerForm.insertBefore(alert, registerForm.firstChild);

    // Auto-eliminar después de 3 segundos
    if (type === 'success') {
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

/**
 * Valida el formulario de registro
 * @returns {boolean} - true si es válido
 */
function validateForm() {
    let isValid = true;
    const name = nameInput?.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();

    // Resetear estilos de error
    [nameInput, emailInput, passwordInput, confirmInput].forEach(input => {
        if (input) input.classList.remove('error');
    });

    // Validar nombre (opcional)
    if (nameInput && name && name.length < 2) {
        nameInput.classList.add('error');
        showAlert('Name must be at least 2 characters');
        isValid = false;
    }

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
    } else if (password.length < 6) {
        passwordInput.classList.add('error');
        showAlert('Password must be at least 6 characters');
        isValid = false;
    }

    // Validar confirmación
    if (password !== confirm) {
        confirmInput.classList.add('error');
        showAlert('Passwords do not match');
        isValid = false;
    }

    // Validar términos
    if (termsCheck && !termsCheck.checked) {
        showAlert('You must agree to the Terms of Service');
        isValid = false;
    }

    return isValid;
}

/**
 * Maneja el envío del formulario
 * @param {Event} e - Evento del formulario
 */
async function handleRegister(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Mostrar loader
    registerBtn.disabled = true;
    btnText.textContent = 'Creating account...';
    btnLoader.style.display = 'inline-block';

    // Pequeño delay para mostrar el loader
    await new Promise(resolve => setTimeout(resolve, 500));

    const name = nameInput?.value.trim() || '';
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Intentar registro
    const result = registerUser(email, password, name);

    if (result.success) {
        showAlert('Account created successfully! Redirecting to login...', 'success');

        // Limpiar formulario
        registerForm.reset();

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showAlert(result.message);

        // Restaurar botón
        registerBtn.disabled = false;
        btnText.textContent = 'Create Account';
        btnLoader.style.display = 'none';

        // Agregar animación de shake
        registerForm.classList.add('shake');
        setTimeout(() => {
            registerForm.classList.remove('shake');
        }, 500);
    }
}

/**
 * Actualiza la fortaleza de la contraseña (opcional)
 */
function updatePasswordStrength() {
    const password = passwordInput.value;
    const strengthIndicator = document.getElementById('password-strength');

    if (!strengthIndicator) return;

    if (password.length === 0) {
        strengthIndicator.style.width = '0';
        strengthIndicator.style.backgroundColor = '#ddd';
    } else if (password.length < 6) {
        strengthIndicator.style.width = '33%';
        strengthIndicator.style.backgroundColor = '#dc3545';
    } else if (password.length < 10) {
        strengthIndicator.style.width = '66%';
        strengthIndicator.style.backgroundColor = '#f5c518';
    } else {
        strengthIndicator.style.width = '100%';
        strengthIndicator.style.backgroundColor = '#28a745';
    }
}

// Event Listeners
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

// Validación en tiempo real para password
if (passwordInput) {
    passwordInput.addEventListener('input', updatePasswordStrength);

    // Crear indicador de fortaleza si no existe
    if (!document.getElementById('password-strength')) {
        const strengthDiv = document.createElement('div');
        strengthDiv.id = 'password-strength';
        strengthDiv.style.height = '4px';
        strengthDiv.style.backgroundColor = '#ddd';
        strengthDiv.style.borderRadius = '2px';
        strengthDiv.style.marginTop = '5px';
        strengthDiv.style.transition = 'all 0.3s';
        passwordInput.parentNode.appendChild(strengthDiv);
    }
}

// Validación en tiempo real para confirmar password
if (confirmInput) {
    confirmInput.addEventListener('input', () => {
        if (confirmInput.value !== passwordInput.value) {
            confirmInput.classList.add('error');
        } else {
            confirmInput.classList.remove('error');
        }
    });
}

// Limpiar mensajes al escribir
[nameInput, emailInput, passwordInput, confirmInput].forEach(input => {
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