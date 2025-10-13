document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitMessage = document.getElementById('submitMessage');

    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        submitMessage.textContent = '';
        emailInput.classList.remove('border-red-500');
        passwordInput.classList.remove('border-red-500');
        emailInput.classList.add('border-gray-600');
        passwordInput.classList.add('border-gray-600');
    }

    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        input.classList.add('border-red-500');
        input.classList.remove('border-gray-600');
    }

    function validateEmail(email) {
        if (!email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    }

    function validatePassword(password) {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return null;
    }

    function findUserByCredentials(email, password) {
        try {
            const users = JSON.parse(localStorage.getItem('authDetails') || '[]');
            return users.find(user =>
                user.email.toLowerCase() === email.toLowerCase() &&
                user.password === password
            );
        } catch (error) {
            console.error('Error reading user data:', error);
            return null;
        }
    }

    emailInput.addEventListener('input', function () {
        if (emailError.textContent) {
            clearErrors();
        }
    });

    passwordInput.addEventListener('input', function () {
        if (passwordError.textContent) {
            clearErrors();
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let hasErrors = false;

        const emailValidation = validateEmail(email);
        if (emailValidation) {
            showError(emailInput, emailError, emailValidation);
            hasErrors = true;
        }

        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            showError(passwordInput, passwordError, passwordValidation);
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        submitMessage.textContent = 'Checking credentials...';
        submitMessage.className = 'text-center text-sm text-yellow-500';


        const user = findUserByCredentials(email, password);

        if (user) {
            localStorage.setItem('typeboost_current_user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');

            submitMessage.textContent = `Welcome back, ${user.name}! Redirecting...`;
            submitMessage.className = 'text-center text-sm text-green-400';

            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        } else {
            const users = JSON.parse(localStorage.getItem('typeboost_users') || '[]');
            const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

            if (userExists) {
                showError(passwordInput, passwordError, 'Incorrect password. Please try again.');
            } else {
                showError(emailInput, emailError, 'No account found with this email address.');
            }

            submitMessage.textContent = 'Login failed. Please check your credentials.';
            submitMessage.className = 'text-center text-sm text-red-400';
        }
    });
});
