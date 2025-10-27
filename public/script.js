// API 基础URL
const API_BASE = '/api';

// DOM 元素和状态
const loginPage = document.getElementById('loginPage');
const mainPage = document.getElementById('mainPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userWelcome = document.getElementById('userWelcome');
const addBtn = document.getElementById('addBtn');
const addModal = document.getElementById('addModal');
const cancelBtn = document.getElementById('cancelBtn');
const addForm = document.getElementById('addForm');
const menuGrid = document.getElementById('menuGrid');
const emptyState = document.getElementById('emptyState');
const imageUploadArea = document.getElementById('imageUploadArea');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentUser = null;
let currentFilter = 'all';
let menuItems = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupEventListeners();
});

function checkLoginStatus() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainPage();
        loadMenuItems();
    }
}

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    addBtn.addEventListener('click', showAddModal);
    cancelBtn.addEventListener('click', hideAddModal);
    addForm.addEventListener('submit', handleAddItem);
    
    imageUploadArea.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderMenuItems();
        });
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainPage();
            loadMenuItems();
            showNotification('登录成功！', 'success');
        } else {
            showNotification(result.message || '登录失败', 'error');
        }
    } catch (error) {
        console.error('登录错误:', error);
        showNotification('登录失败，请检查API连接', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    showLoginPage();
    showNotification('已退出登录', 'info');
}

function showLoginPage() {
    mainPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    loginForm.reset();
}

function showMainPage() {
    loginPage.classList.add('hidden');
    mainPage.classList.remove('hidden');
    userWelcome.textContent = `欢迎，${currentUser.username}`;
}

function showAddModal() {
    addModal.classList.remove('hidden');
    addForm.reset();
    imagePreview.classList.add('hidden');
}

function hideAddModal() {
    addModal.classList.add('hidden');
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

async function handleAddItem(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const type = document.querySelector('input[name="itemType"]:checked').value;
    const image = previewImg.src || '';
    
    try {
        const response = await fetch(`${API_BASE}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, type, image })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            hideAddModal();
            loadMenuItems();
            showNotification('菜品添加成功！', 'success');
        } else {
            showNotification(result.message || '添加失败', 'error');
        }
    } catch (error) {
        console.error('添加菜品错误:', error);
        showNotification('添加失败，请检查API连接', 'error');
    }
}

async function loadMenuItems() {
    try {
        const response = await fetch(`${API_BASE}/menu`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            menuItems = result.data;
            renderMenuItems();
        }
    } catch (error) {
        console.error('加载菜单错误:', error);
    }
}

function renderMenuItems() {
    const filteredItems = currentFilter === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.type === currentFilter);
    
    if (filteredItems.length === 0) {
        menuGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    menuGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="card-hover bg-white rounded-xl shadow-lg overflow-hidden fade-in">
            <div class="h-48 bg-gray-200 relative">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                <div class="absolute top-4 right-4">
                    <span class="${item.type === 'meal' ? 'bg-green-500' : 'bg-orange-500'} text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${item.type === 'meal' ? '餐点' : '套餐'}
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${item.name}</h3>
                <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>${new Date(item.createdAt).toLocaleDateString('zh-TW')}</span>
                    <div class="flex space-x-2">
                        <button class="text-blue-500 hover:text-blue-700 transition-colors">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-700 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 slide-up ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

addModal.addEventListener('click', function(e) {
    if (e.target === addModal) {
        hideAddModal();
    }
});

loadMenuItems();
