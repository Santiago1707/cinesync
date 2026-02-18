// js/auth.js
// Módulo de autenticación para CineSync

const USERS_KEY = 'cinesync_users';
const CURRENT_USER_KEY = 'cinesync_current_user';

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Obtiene la lista de usuarios del localStorage
 * @returns {Array} Array de usuarios
 */
function getUsers() {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

/**
 * Guarda la lista de usuarios en localStorage
 * @param {Array} users - Array de usuarios
 */
function saveUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Registra un nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} name - Nombre del usuario
 * @returns {Object} Resultado de la operación
 */
function registerUser(email, password, name = '') {
    // Validaciones
    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required'
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            message: 'Password must be at least 6 characters'
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: 'Invalid email format'
        };
    }

    const users = getUsers();

    // Verificar si el email ya existe
    if (users.some(u => u.email === email)) {
        return {
            success: false,
            message: 'Email already registered'
        };
    }

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        email,
        password, // En producción, esto debería estar encriptado
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
        watchlist: []
    };

    users.push(newUser);
    saveUsers(users);

    return {
        success: true,
        message: 'User registered successfully',
        user: { id: newUser.id, email: newUser.email, name: newUser.name }
    };
}

/**
 * Inicia sesión de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Object} Resultado de la operación
 */
function loginUser(email, password) {
    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required'
        };
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // Guardar usuario actual
    const currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    return {
        success: true,
        message: 'Login successful',
        user: currentUser
    };
}

/**
 * Cierra sesión del usuario actual
 */
function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
    return {
        success: true,
        message: 'Logout successful'
    };
}

/**
 * Obtiene el usuario actualmente logueado
 * @returns {Object|null} Usuario actual o null
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Verifica si hay un usuario logueado
 * @returns {boolean}
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Crea un usuario de demostración
 */
function createDemoUser() {
    const demoEmail = 'demo@cinesync.com';
    const demoPassword = 'demo123';

    const users = getUsers();
    if (!users.some(u => u.email === demoEmail)) {
        registerUser(demoEmail, demoPassword, 'Demo User');
    }

    return { email: demoEmail, password: demoPassword };
}

// ============================================
// EXPORTACIONES
// ============================================

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    isLoggedIn,
    createDemoUser
};