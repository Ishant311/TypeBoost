document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const editToggle = document.getElementById('editToggle');
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const profileForm = document.getElementById('profileForm');
    const cancelEdit = document.getElementById('cancelEdit');
    const logoutBtn = document.getElementById('logoutBtn');
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');

    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');

    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordError = document.getElementById('newPasswordError');
    const updateMessage = document.getElementById('updateMessage');

    let currentUser = null;

    function loadUserData() {
        try {
            const authDetails = JSON.parse(localStorage.getItem('current-user')) || {};
            console.log(authDetails);
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (!isLoggedIn || !authDetails.email) {
                window.location.href = '../auth/login.html';
                return;
            }

            currentUser = authDetails;
            updateDisplay();
        } catch (error) {
            console.error('Error loading user data:', error);
            window.location.href = '../auth/login.html';
        }
    }

function updateDisplay() {
    if (currentUser) {
        displayName.innerHTML = currentUser.name || 'Not set';
        displayEmail.innerHTML = currentUser.email || 'Not set';
    }
}

function toggleEditMode() {
    const isEditMode = editMode.classList.contains('hidden');

    if (isEditMode) {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
        editToggle.textContent = 'Cancel';
        editToggle.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        editToggle.classList.add('bg-gray-600', 'hover:bg-gray-700');

        editName.value = currentUser.name || '';
        editEmail.value = currentUser.email || '';
        currentPassword.value = '';
        newPassword.value = '';
        clearErrors();
    } else {
        cancelEditMode();
    }
}

function cancelEditMode() {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
    editToggle.textContent = 'Edit Profile';
    editToggle.classList.remove('bg-gray-600', 'hover:bg-gray-700');
    editToggle.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    clearErrors();
    updateMessage.textContent = '';
}

function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    currentPasswordError.textContent = '';
    newPasswordError.textContent = '';

    [editName, editEmail, currentPassword, newPassword].forEach(input => {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-600');
    });
}

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add('border-red-500');
    input.classList.remove('border-gray-600');
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
    if (password && password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    return null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = editName.value.trim();
    const email = editEmail.value.trim();
    const currentPass = currentPassword.value;
    const newPass = newPassword.value;

    let hasErrors = false;
    const nameValidation = validateName(name);
    if (nameValidation) {
        showError(editName, nameError, nameValidation);
        hasErrors = true;
    }

    const emailValidation = validateEmail(email);
    if (emailValidation) {
        showError(editEmail, emailError, emailValidation);
        hasErrors = true;
    }
    if (!currentPass) {
        showError(currentPassword, currentPasswordError, 'Current password is required to save changes');
        hasErrors = true;
    } else if (currentUser.password && currentPass !== currentUser.password) {
        showError(currentPassword, currentPasswordError, 'Current password is incorrect');
        hasErrors = true;
    }

    if (newPass) {
        const passwordValidation = validatePassword(newPass);
        if (passwordValidation) {
            showError(newPassword, newPasswordError, passwordValidation);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        return;
    }

    updateMessage.textContent = 'Saving changes...';
    updateMessage.className = 'text-center text-sm text-yellow-500';

    setTimeout(() => {
        try {
            const updatedUser = {
                ...currentUser,
                name: name,
                email: email
            };

            if (newPass) {
                updatedUser.password = newPass;
            }
            localStorage.setItem('current-user', JSON.stringify(updatedUser));
            currentUser = updatedUser;

            updateDisplay();
            cancelEditMode();

            updateMessage.textContent = 'Profile updated successfully!';
            updateMessage.className = 'text-center text-sm text-green-400';

            setTimeout(() => {
                updateMessage.textContent = '';
            }, 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            updateMessage.textContent = 'Failed to update profile. Please try again.';
            updateMessage.className = 'text-center text-sm text-red-400';
        }
    }, 800);
}

function handleLogout() {
    localStorage.removeItem('authDetails');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../auth/login.html';
}

editToggle.addEventListener('click', toggleEditMode);
cancelEdit.addEventListener('click', cancelEditMode);
profileForm.addEventListener('submit', handleFormSubmit);
logoutBtn.addEventListener('click', handleLogout);


editName.addEventListener('input', () => {
    if (nameError.textContent) {
        nameError.textContent = '';
        editName.classList.remove('border-red-500');
        editName.classList.add('border-gray-600');
    }
});

editEmail.addEventListener('input', () => {
    if (emailError.textContent) {
        emailError.textContent = '';
        editEmail.classList.remove('border-red-500');
        editEmail.classList.add('border-gray-600');
    }
});

currentPassword.addEventListener('input', () => {
    if (currentPasswordError.textContent) {
        currentPasswordError.textContent = '';
        currentPassword.classList.remove('border-red-500');
        currentPassword.classList.add('border-gray-600');
    }
});

newPassword.addEventListener('input', () => {
    if (newPasswordError.textContent) {
        newPasswordError.textContent = '';
        newPassword.classList.remove('border-red-500');
        newPassword.classList.add('border-gray-600');
    }
});

loadUserData();
});