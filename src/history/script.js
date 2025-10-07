let allResults = [];
let filteredResults = [];
let sortDirection = { wpm: 'desc', accuracy: 'desc' };
let loginStatus = localStorage.getItem('isLoggedIn') === 'true';
let authDetails = localStorage.getItem('authDetails') || null;

function updateUserInfo() {
    try {
        const authDetails = localStorage.getItem('authDetails');
        if (authDetails) {
            const user = JSON.parse(authDetails);
            const email = user.email || 'guest@example.com';
            const name = email.split('@')[0];
            const initials = name.charAt(0).toUpperCase();
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            if (userAvatar && userName) {
                userAvatar.textContent = initials;
                userName.textContent = name;
            }

            const mobileUserAvatar = document.getElementById('mobile-user-avatar');
            const mobileUserName = document.getElementById('mobile-user-name');
            if (mobileUserAvatar && mobileUserName) {
                mobileUserAvatar.textContent = initials;
                mobileUserName.textContent = name;
            }
        }
    } catch (e) {
        console.log('No user data found in localStorage');
    }
}

document.addEventListener('DOMContentLoaded', updateUserInfo);

document.addEventListener('DOMContentLoaded', function () {
    if (loginStatus && authDetails) {
        loadResults();
        setupEventListeners();
        displayResults();
        updateStatistics();
    }
    else {
        window.location.href = '../auth/login.html';
    }
});

function setupEventListeners() {
    const difficultyFilter = document.getElementById('difficulty-filter');
    const timeFilter = document.getElementById('time-filter');

    difficultyFilter.addEventListener('change', applyFilters);
    difficultyFilter.addEventListener('input', applyFilters);

    timeFilter.addEventListener('change', applyFilters);
    timeFilter.addEventListener('input', applyFilters);

    document.getElementById('sort-wpm').addEventListener('click', () => sortResults('wpm'));
    document.getElementById('sort-accuracy').addEventListener('click', () => sortResults('accuracy'));

    document.getElementById('clear-history').addEventListener('click', clearHistory);
}

function loadResults() {
    const results = localStorage.getItem('typingResults');
    allResults = results ? JSON.parse(results) : [];
    filteredResults = [...allResults];
}

function applyFilters() {
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    const timeFilter = document.getElementById('time-filter').value;

    filteredResults = allResults.filter(result => {
        const matchesDifficulty = !difficultyFilter || result.difficulty === difficultyFilter;
        const matchesTime = !timeFilter || result.time.toString() === timeFilter;

        return matchesDifficulty && matchesTime;
    });

    displayResults();
    updateStatistics();
}

function sortResults(column) {
    const direction = sortDirection[column];

    filteredResults.sort((a, b) => {
        const valueA = column === 'wpm' ? a.wpm : a.accuracy;
        const valueB = column === 'wpm' ? b.wpm : b.accuracy;

        if (direction === 'asc') {
            return valueA - valueB;
        } else {
            return valueB - valueA;
        }
    });

    sortDirection[column] = direction === 'asc' ? 'desc' : 'asc';

    updateSortIcons(column, sortDirection[column]);

    displayResults();
}

function updateSortIcons(activeColumn, direction) {
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.textContent = '↕';
    });

    const activeIcon = document.querySelector(`#sort-${activeColumn} .sort-icon`);
    if (activeIcon) {
        activeIcon.textContent = direction === 'asc' ? '↑' : '↓';
    }
}

function displayResults() {
    const tbody = document.getElementById('history-table-body');
    const mobileCards = document.getElementById('mobile-cards');
    const emptyState = document.getElementById('empty-state');
    const table = tbody.closest('div');

    console.log('Displaying results:', filteredResults.length); // Debug log

    if (filteredResults.length === 0) {
        if (table) table.style.display = 'none';
        mobileCards.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    if (table) table.style.display = 'block';
    emptyState.classList.add('hidden');

    tbody.innerHTML = filteredResults.map(result => {
        const date = new Date(result.timestamp).toLocaleDateString();
        const time = new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <tr class="hover:bg-gray-700 transition-colors duration-200">
                <td class="px-3 py-4 text-left">
                    <div class="text-sm text-white">${date}</div>
                    <div class="text-xs text-gray-400">${time}</div>
                </td>
                <td class="px-3 py-4 text-center">
                    <div class="text-lg font-bold text-yellow-500">${result.wpm}</div>
                </td>
                <td class="px-3 py-4 text-center">
                    <div class="text-lg font-bold ${result.accuracy >= 95 ? 'text-green-400' : result.accuracy >= 85 ? 'text-yellow-500' : 'text-red-400'}">${result.accuracy}%</div>
                </td>
                <td class="px-3 py-4 text-center">
                    <div class="text-sm text-red-400">${result.errors}</div>
                </td>
                <td class="px-3 py-4 text-center">
                    <div class="text-sm text-gray-300">${result.time}s</div>
                </td>
                <td class="px-3 py-4 text-center">
                    <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(result.difficulty)}">
                        ${result.difficulty}
                    </span>
                </td>
                <td class="px-3 py-4 text-center">
                    <div class="text-sm text-gray-300">${result.charsTyped}</div>
                </td>
            </tr>
        `;
    }).join('');

    mobileCards.innerHTML = filteredResults.map(result => {
        const date = new Date(result.timestamp).toLocaleDateString();
        const time = new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <div class="text-sm text-white font-medium">${date}</div>
                        <div class="text-xs text-gray-400">${time}</div>
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(result.difficulty)}">
                        ${result.difficulty}
                    </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-3">
                    <div class="text-center bg-gray-700 rounded-lg p-3">
                        <div class="text-2xl font-bold text-yellow-500">${result.wpm}</div>
                        <div class="text-xs text-gray-400">WPM</div>
                    </div>
                    <div class="text-center bg-gray-700 rounded-lg p-3">
                        <div class="text-2xl font-bold ${result.accuracy >= 95 ? 'text-green-400' : result.accuracy >= 85 ? 'text-yellow-500' : 'text-red-400'}">${result.accuracy}%</div>
                        <div class="text-xs text-gray-400">Accuracy</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2 text-center">
                    <div class="bg-gray-700 rounded-lg p-2">
                        <div class="text-sm font-medium text-red-400">${result.errors}</div>
                        <div class="text-xs text-gray-400">Errors</div>
                    </div>
                    <div class="bg-gray-700 rounded-lg p-2">
                        <div class="text-sm font-medium text-gray-300">${result.time}s</div>
                        <div class="text-xs text-gray-400">Time</div>
                    </div>
                    <div class="bg-gray-700 rounded-lg p-2">
                        <div class="text-sm font-medium text-gray-300">${result.charsTyped}</div>
                        <div class="text-xs text-gray-400">Chars</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 'bg-green-900 text-green-300';
        case 'medium':
            return 'bg-yellow-900 text-yellow-300';
        case 'hard':
            return 'bg-red-900 text-red-300';
        default:
            return 'bg-gray-700 text-gray-300';
    }
}

function updateStatistics() {
    const results = filteredResults.length > 0 ? filteredResults : allResults;

    if (results.length === 0) {
        document.getElementById('total-tests').textContent = '0';
        document.getElementById('avg-wpm').textContent = '0';
        document.getElementById('best-wpm').textContent = '0';
        document.getElementById('avg-accuracy').textContent = '0%';
        return;
    }

    const totalTests = results.length;
    const avgWpm = Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / totalTests);
    const bestWpm = Math.max(...results.map(result => result.wpm));
    const avgAccuracy = Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / totalTests);

    document.getElementById('total-tests').textContent = totalTests;
    document.getElementById('avg-wpm').textContent = avgWpm;
    document.getElementById('best-wpm').textContent = bestWpm;
    document.getElementById('avg-accuracy').textContent = `${avgAccuracy}%`;
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all typing test history? This action cannot be undone.')) {
        localStorage.removeItem('typingResults');
        allResults = [];
        filteredResults = [];
        displayResults();
        updateStatistics();

        showNotification('History cleared successfully!');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.getElementById('mobile-menu-btn').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});
