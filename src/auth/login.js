(function() {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitMessage = document.getElementById('submitMessage');

    function validateField(field, errorElement, validationFn, errorMessage) {
        const isValid = validationFn(field.value);
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.classList.add('border-red-500');
            field.classList.remove('border-gray-600');
        } else {
            errorElement.textContent = '';
            field.classList.remove('border-red-500');
            field.classList.add('border-gray-600');
        }
        return isValid;
    }

    function validateEmail(email) {
        return email && /^\S+@\S+\.\S+$/.test(email);
    }

    function validatePassword(password) {
        
        return password && password.length > 8;
    }

    function validateForm() {
        const isEmailValid = validateField(
            email, 
            emailError, 
            validateEmail, 
            'Please enter a valid email address'
        );
        
        const isPasswordValid = validateField(
            password, 
            passwordError, 
            validatePassword, 
            'Password must be at least 8 characters long'
        );

        return isEmailValid && isPasswordValid;
    }

    email.addEventListener('blur', () => validateField(email, emailError, validateEmail, 'Please enter a valid email address'));
    password.addEventListener('blur', () => validateField(password, passwordError, validatePassword, 'Password must be at least 6 characters long'));

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitMessage.textContent = '';
        
        if (!validateForm()) {
            return;
        }

        submitMessage.textContent = 'Signing in...';
        submitMessage.className = 'text-center text-sm text-yellow-500';
        const userData = {
            email: email.value,
            name: email.value.split('@')[0]
        };

        localStorage.setItem('authDetails', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        submitMessage.textContent = 'Login successful! Redirecting...';
        submitMessage.className = 'text-center text-sm text-green-400';
        
        window.location.href = '../index.html';
    });
})();
