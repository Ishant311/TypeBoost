document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const submitMessage = document.getElementById('submitMessage');

    function clearErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        submitMessage.textContent = '';
    }

    function showError(element, message) {
        element.textContent = message;
        element.parentElement.querySelector('input').classList.add('border-red-500');
    }

    function clearFieldError(input, errorElement) {
        errorElement.textContent = '';
        input.classList.remove('border-red-500');
    }

    function validateName(name) {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        return null;
    }

    function validateEmail(email) {
        if (!email) {
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
            return 'Password must be at least 8 characters';
        }
        return null;
    }

    function validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) {
            return 'Please confirm your password';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    }


    function emailExists(email) {
        const users = JSON.parse(localStorage.getItem('typeboost_users') || '[]');
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    nameInput.addEventListener('input', function() {
        clearFieldError(this, nameError);
    });

    emailInput.addEventListener('input', function() {
        clearFieldError(this, emailError);
    });

    passwordInput.addEventListener('input', function() {
        clearFieldError(this, passwordError);
        if (confirmPasswordInput.value) {
            clearFieldError(confirmPasswordInput, confirmPasswordError);
        }
    });

    confirmPasswordInput.addEventListener('input', function() {
        clearFieldError(this, confirmPasswordError);
    });


    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        let hasErrors = false;

        const nameValidation = validateName(name);
        if (nameValidation) {
            showError(nameError, nameValidation);
            hasErrors = true;
        }

        const emailValidation = validateEmail(email);
        if (emailValidation) {
            showError(emailError, emailValidation);
            hasErrors = true;
        } else if (emailExists(email)) {
            showError(emailError, 'An account with this email already exists');
            hasErrors = true;
        }

        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            showError(passwordError, passwordValidation);
            hasErrors = true;
        }

        const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
        if (confirmPasswordValidation) {
            showError(confirmPasswordError, confirmPasswordValidation);
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('authDetails') || '[]');
            
            const newUser = {
                name: name,
                email: email,
                password: password,
            };

            users.push(newUser);
            localStorage.setItem('authDetails', JSON.stringify(users));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('current-user', JSON.stringify(newUser));

            submitMessage.textContent = 'Account created successfully! Redirecting...';
            submitMessage.className = 'text-center text-sm text-green-400';

            window.location.href = '../index.html';
            

        } catch (error) {
            console.error('Error creating account:', error);
            submitMessage.textContent = 'An error occurred. Please try again.';
            submitMessage.className = 'text-center text-sm text-red-400';
        }
    });
});
