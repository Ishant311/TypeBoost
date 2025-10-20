const sentences = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "Practice makes perfect in everything we do.",
        "Time flies when you are having fun.",
        "The early bird catches the worm."
    ],
    medium: [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The only way to do great work is to love what you do and never give up.",
        "Innovation distinguishes between a leader and a follower in modern business.",
        "Technology has revolutionized the way we communicate and work together.",
        "Critical thinking skills are essential for solving complex problems effectively."
    ],
    hard: [
        "Pseudopseudohypoparathyroidism is a rare inherited disorder affecting calcium metabolism.",
        "The implementation of sophisticated algorithms requires comprehensive understanding of computational complexity.",
        "Quantum entanglement demonstrates the peculiar interconnectedness of subatomic particles across vast distances.",
        "Neuroplasticity enables the brain to reorganize and adapt throughout an individual's lifetime.",
        "Cryptocurrency blockchain technology utilizes cryptographic hashing to ensure transaction integrity."
    ]
};

let currentSentence = '';
let currentDifficulty = 'easy';
let startTime = null;
let errors = 0;
let isTyping = false;
let testDuration = parseInt(localStorage.getItem('setTime')) || 30;
let timeRemaining = testDuration;
let timerInterval = null;
let testActive = false;

let loginStatus = localStorage.getItem('isLoggedIn') === 'true';
let authDetails = localStorage.getItem('authDetails') || null;

let totalCorrectChars = 0;
let totalTypedChars = 0;
let totalErrors = 0;

const sentenceDisplay = document.getElementById('sentence-display');
const typingInput = document.getElementById('typing-input');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const errorsDisplay = document.getElementById('errors-display');
const progressBar = document.getElementById('progress-bar');
const resultsModal = document.getElementById('results-modal');

function updateUserInfo() {
    try {
        const authDetails = localStorage.getItem('authDetails');
        if (authDetails) {
            const user = JSON.parse(authDetails);
            const email = user.email || 'guest@example.com';
            const name = email.split('@')[0];

            
        }
    } catch (e) {
        console.log('No user data found in localStorage');
    }
}

document.addEventListener('DOMContentLoaded', updateUserInfo);


document.addEventListener('DOMContentLoaded', function () {
    if (!loginStatus || !authDetails) {
        window.location.href = '../auth/login.html';
        return;
    }
    setupEventListeners();
    loadTimer();
    generateNewSentence();
});

function loadTimer() {
    testDuration = parseInt(localStorage.getItem('setTime')) || 30;
    timeRemaining = testDuration;
}

function updateTimerDisplay() {
    let timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay && testActive) {
        timerDisplay = createTimerDisplay();
    }
    if (timerDisplay) {
        timerDisplay.textContent = `${timeRemaining}s`;
    }
}

function createTimerDisplay() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timer-display';
    timerDiv.className = 'absolute bottom-2 right-2 text-lg font-bold text-yellow-500 bg-gray-800 px-2 py-1 rounded border border-gray-600 z-10';
    timerDiv.textContent = `${timeRemaining}s`;
    const inputContainer = typingInput.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(timerDiv);
    return timerDiv;
}

function setupEventListeners() {
    document.getElementById('easy-btn').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('medium-btn').addEventListener('click', () => setDifficulty('medium'));
    document.getElementById('hard-btn').addEventListener('click', () => setDifficulty('hard'));
    document.getElementById('new-sentence-btn').addEventListener('click', generateNewSentence);
    document.getElementById('restart-btn').addEventListener('click', restartTest);
    const nextBtn = document.getElementById('next-sentence-btn');
    const closeBtn = document.getElementById('close-results');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            closeResults();
            restartTest();
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeResults);
    }
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('keydown', (e) => {
        if (!testActive && !startTime && e.key.length === 1) {
            startTest();
        }
    });
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    document.getElementById('easy-btn').className = 'px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-200';
    document.getElementById('medium-btn').className = 'px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-200';
    document.getElementById('hard-btn').className = 'px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-200';
    document.getElementById(`${difficulty}-btn`).className = 'px-4 py-2 rounded-lg border border-yellow-500 text-yellow-500 bg-gray-800 transition-all duration-200';
}

function startTest() {
    if (!testActive && !startTime) {
        testActive = true;
        startTime = Date.now();
        timeRemaining = testDuration;
        createTimerDisplay();
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (timeRemaining <= 0) {
                endTest();
            }
        }, 1000);
        if (sentenceDisplay.querySelector('.text-gray-500')) {
            generateNewSentence();
        }
    }
}

function endTest() {
    testActive = false;
    clearInterval(timerInterval);
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.remove();
    }
    const typed = typingInput.value;
    if (typed.length > 0) {
        let finalCorrect = 0;
        let finalErrors = 0;

        for (let i = 0; i < typed.length; i++) {
            if (i < currentSentence.length && typed[i] === currentSentence[i]) {
                finalCorrect++;
            } else {
                finalErrors++;
            }
        }

        totalCorrectChars += finalCorrect;
        totalTypedChars += typed.length;
        totalErrors += finalErrors;
    }

    const timeElapsed = testDuration;
    const wpm = totalCorrectChars > 0 ? Math.round((totalCorrectChars / 5) / (timeElapsed / 60)) : 0;
    const accuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 0;
    storeResults(wpm, accuracy, totalErrors, timeElapsed, totalTypedChars);
    showResults(wpm, accuracy, totalErrors, timeElapsed);
    typingInput.disabled = true;
}

function calculateCorrectChars(typed) {
    let correct = 0;
    for (let i = 0; i < typed.length && i < currentSentence.length; i++) {
        if (typed[i] === currentSentence[i]) {
            correct++;
        }
    }
    return correct;
}

function storeResults(wpm, accuracy, errors, time, charsTyped) {
    const result = {
        wpm: wpm,
        accuracy: accuracy,
        errors: errors,
        time: time,
        charsTyped: charsTyped,
        difficulty: currentDifficulty,
        sentence: currentSentence,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };
    let results = JSON.parse(localStorage.getItem('typingResults')) || [];
    results.unshift(result);
    if (results.length > 50) {
        results = results.slice(0, 50);
    }
    localStorage.setItem('typingResults', JSON.stringify(results));
}

function generateNewSentence() {
    const sentenceList = sentences[currentDifficulty];
    currentSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];

    displaySentence();
    resetStats();
    enableInput();
}

function displaySentence() {
    sentenceDisplay.innerHTML = currentSentence.split('').map(char =>
        `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    sentenceDisplay.style.textAlign = 'left';
    sentenceDisplay.style.lineHeight = '1.8';
    sentenceDisplay.style.wordBreak = 'break-word';
    sentenceDisplay.style.whiteSpace = 'normal';
}

function resetStats() {
    startTime = null;
    errors = 0;
    testActive = false;
    timeRemaining = testDuration;
    totalCorrectChars = 0;
    totalTypedChars = 0;
    totalErrors = 0;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.remove();
    }

    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    errorsDisplay.textContent = '0';
    progressBar.style.width = '0%';

    typingInput.value = '';
}

function restartTest() {
    resetStats();
    loadTimer();
    generateNewSentence();
    typingInput.focus();
}

function enableInput() {
    typingInput.disabled = false;
    document.getElementById('restart-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
    typingInput.focus();
}

function handleTyping() {
    if (!testActive && !startTime) {
        startTest();
    }

    if (!testActive) return;

    const typed = typingInput.value;
    const chars = document.querySelectorAll('.char');

    let correctChars = 0;
    let currentErrors = 0;
    for (let i = 0; i < typed.length; i++) {
        if (i < currentSentence.length) {
            if (typed[i] === currentSentence[i]) {
                correctChars++;
            } else {
                currentErrors++;
            }
        } else {
            currentErrors++;
        }
    }
    chars.forEach((char, index) => {
        char.className = 'char';

        if (index < typed.length) {
            if (index < currentSentence.length && typed[index] === currentSentence[index]) {
                char.classList.add('text-green-400');
            } else {
                char.classList.add('text-red-400', 'bg-red-900');
            }
        } else if (index === typed.length) {
            char.classList.add('bg-yellow-500', 'text-gray-900');
        }
    });
    const progress = ((testDuration - timeRemaining) / testDuration) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    updateStats(typed.length, correctChars, currentErrors);
    if (typed === currentSentence) {
        totalCorrectChars += correctChars;
        totalTypedChars += typed.length;
        totalErrors += currentErrors;
        const sentenceList = sentences[currentDifficulty];
        currentSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
        displaySentence();
        typingInput.value = '';
    }
}

function updateStats(typedLength, correctChars, currentErrors) {
    if (!startTime || !testActive) return;

    const timeElapsed = (testDuration - timeRemaining) / 60;
    const currentTotalCorrect = totalCorrectChars + correctChars;
    const currentTotalTyped = totalTypedChars + typedLength;
    const currentTotalErrors = totalErrors + currentErrors;

    const wpm = timeElapsed > 0 ? Math.round((currentTotalCorrect / 5) / timeElapsed) : 0;
    const accuracy = currentTotalTyped > 0 ? Math.round((currentTotalCorrect / currentTotalTyped) * 100) : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
    errorsDisplay.textContent = currentTotalErrors;
}

function showResults(wpm, accuracy, errors, time) {
    const finalWpm = document.getElementById('final-wpm');
    const finalAccuracy = document.getElementById('final-accuracy');
    const finalErrors = document.getElementById('final-errors');
    const finalTime = document.getElementById('final-time');

    if (finalWpm) finalWpm.textContent = wpm;
    if (finalAccuracy) finalAccuracy.textContent = `${accuracy}%`;
    if (finalErrors) finalErrors.textContent = errors;
    if (finalTime) finalTime.textContent = `${time}s`;
    if (resultsModal) {
        resultsModal.style.display = 'flex';
        resultsModal.classList.remove('hidden');
    }
}

function closeResults() {
    if (resultsModal) {
        resultsModal.style.display = 'none';
        resultsModal.classList.add('hidden');
    }
}

document.getElementById('mobile-menu-btn').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});
