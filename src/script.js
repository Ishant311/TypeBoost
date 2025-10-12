let setTime = null;
let setSelected = localStorage.getItem('setTime') || 15;

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

document.addEventListener('DOMContentLoaded', function() {
    if (setSelected) {
        setTime = parseInt(setSelected);
        setTimerButtonStyles();
    }
});
