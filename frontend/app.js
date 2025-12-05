const API_URL = 'http://localhost:80';

// State
let token = localStorage.getItem('token');
let currentUser = localStorage.getItem('username');

// DOM Elements
const authView = document.getElementById('authView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const usersGrid = document.getElementById('usersGrid');
const currentUsernameSpan = document.getElementById('currentUsername');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Init
function init() {
    if (token) {
        showDashboard();
    } else {
        showAuth();
    }

    // Event Listeners
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    refreshBtn.addEventListener('click', loadUsers);
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Неверное имя пользователя или пароль');

        const data = await response.json();
        token = data.access_token;
        currentUser = username;
        
        localStorage.setItem('token', token);
        localStorage.setItem('username', currentUser);
        
        showToast('Успешный вход!', 'success');
        showDashboard();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Ошибка регистрации');
        }

        showToast('Регистрация успешна! Теперь войдите.', 'success');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function handleLogout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showAuth();
    showToast('Вы вышли из системы', 'success');
}

// Dashboard Functions
function showAuth() {
    authView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showDashboard() {
    authView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    currentUsernameSpan.textContent = currentUser;
    loadUsers();
}

async function loadUsers() {
    usersGrid.innerHTML = '<div class="loading">Загрузка пользователей...</div>';
    
    try {
        const response = await fetch(`${API_URL}/users/`, {
            headers: {
                'Authorization': `Bearer ${token}` // Note: User service might not require auth for list, but good practice
            }
        });

        if (!response.ok) throw new Error('Не удалось загрузить пользователей');

        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        usersGrid.innerHTML = `<div class="loading" style="color: var(--error-color)">Ошибка: ${error.message}</div>`;
    }
}

function renderUsers(users) {
    usersGrid.innerHTML = '';
    
    if (users.length === 0) {
        usersGrid.innerHTML = '<div class="loading">Нет пользователей</div>';
        return;
    }

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-avatar">${user.username[0].toUpperCase()}</div>
            <div class="user-name">${user.username}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-id">ID: ${user.id}</div>
            <div class="user-status ${user.is_active ? 'active' : 'inactive'}">
                ${user.is_active ? 'Активен' : 'Неактивен'}
            </div>
            <div class="user-actions">
                <button class="btn btn-secondary btn-small btn-danger" onclick="deleteUser(${user.id})">Удалить</button>
            </div>
        `;
        usersGrid.appendChild(card);
    });
}

window.deleteUser = async function(userId) {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Ошибка удаления');

        showToast('Пользователь удален', 'success');
        loadUsers();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

// UI Helpers
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Start
init();
