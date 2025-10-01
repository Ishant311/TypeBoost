let setTime = null;
let setSelected = localStorage.getItem('setTime') || 15;
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



document.querySelectorAll('.timer-btn').forEach(button => {
    button.addEventListener('click', () => {
        setTime = parseInt(button.getAttribute('data-time'));
        localStorage.setItem('setTime', setTime);
        clearButtonStyles();
        button.className = 'timer-btn px-8 py-3 text-xl rounded-lg border border-yellow-500 text-yellow-500 bg-gray-800 transition-all duration-200';
    });
});

function clearButtonStyles() {
    document.querySelectorAll('.timer-btn').forEach(button => {
        button.className = 'timer-btn px-8 py-3 text-xl rounded-lg border border-gray-600 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-200';
    });
}

function setTimerButtonStyles() {
    document.querySelectorAll('.timer-btn').forEach(button => {
        if (parseInt(button.getAttribute('data-time')) === parseInt(setTime)) {
            button.className = 'timer-btn px-8 py-3 text-xl rounded-lg border border-yellow-500 text-yellow-500 bg-gray-800 transition-all duration-200';
        }
    });
}

document.querySelector('.start-btn').addEventListener('click', () => {
    localStorage.setItem('setTime', setTime);
    window.location.href = 'typing/index.html';
});

document.addEventListener('DOMContentLoaded', function () {
    if (!loginStatus || !authDetails) {
        window.location.href = 'auth/login.html';
        return;
    }
    if (setSelected) {
        setTime = parseInt(setSelected);
        setTimerButtonStyles();
    }
});

document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});
