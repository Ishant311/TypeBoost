// Sample sentences by difficulty
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

// DOM elements
const sentenceDisplay = document.getElementById('sentence-display');
const typingInput = document.getElementById('typing-input');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const errorsDisplay = document.getElementById('errors-display');
const progressBar = document.getElementById('progress-bar');
const resultsModal = document.getElementById('results-modal');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // Difficulty buttons
    document.getElementById('easy-btn').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('medium-btn').addEventListener('click', () => setDifficulty('medium'));
    document.getElementById('hard-btn').addEventListener('click', () => setDifficulty('hard'));
    
    // Control buttons
    document.getElementById('new-sentence-btn').addEventListener('click', generateNewSentence);
    document.getElementById('restart-btn').addEventListener('click', restartSentence);
    document.getElementById('skip-btn').addEventListener('click', generateNewSentence);
    
    // Results modal buttons
    document.getElementById('next-sentence-btn').addEventListener('click', () => {
        closeResults();
        generateNewSentence();
    });
    document.getElementById('close-results').addEventListener('click', closeResults);
    
    // Typing input
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('focus', startTyping);
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Update button styles
    document.querySelectorAll('[id$="-btn"]:not(#new-sentence-btn):not(#restart-btn):not(#skip-btn)').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-200';
    });
    
    document.getElementById(`${difficulty}-btn`).className = 'px-4 py-2 rounded-lg border border-yellow-500 text-yellow-500 bg-gray-800 transition-all duration-200';
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
        `<span class="char">${char}</span>`
    ).join('');
}

function resetStats() {
    startTime = null;
    errors = 0;
    isTyping = false;
    
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    errorsDisplay.textContent = '0';
    progressBar.style.width = '0%';
    
    typingInput.value = '';
}

function enableInput() {
    typingInput.disabled = false;
    document.getElementById('restart-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
    typingInput.focus();
}

function startTyping() {
    if (!startTime) {
        startTime = Date.now();
        isTyping = true;
    }
}

function handleTyping() {
    if (!startTime) startTyping();
    
    const typed = typingInput.value;
    const chars = document.querySelectorAll('.char');
    
    let correctChars = 0;
    let currentErrors = 0;
    
    // Update character highlighting
    chars.forEach((char, index) => {
        char.className = 'char';
        
        if (index < typed.length) {
            if (typed[index] === currentSentence[index]) {
                char.classList.add('text-green-400');
                correctChars++;
            } else {
                char.classList.add('text-red-400', 'bg-red-900');
                currentErrors++;
            }
        } else if (index === typed.length) {
            char.classList.add('bg-yellow-500', 'text-gray-900');
        }
    });
    
    // Update progress
    const progress = (typed.length / currentSentence.length) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    
    // Update stats
    updateStats(typed.length, correctChars, currentErrors);
    
    // Check completion
    if (typed === currentSentence) {
        completeTyping();
    }
}

function updateStats(typedLength, correctChars, currentErrors) {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wpm = Math.round((correctChars / 5) / timeElapsed) || 0;
    const accuracy = typedLength > 0 ? Math.round((correctChars / typedLength) * 100) : 100;
    
    errors = currentErrors;
    
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
    errorsDisplay.textContent = errors;
}

function completeTyping() {
    const timeElapsed = (Date.now() - startTime) / 1000;
    const wpm = Math.round((currentSentence.length / 5) / (timeElapsed / 60));
    const accuracy = Math.round(((currentSentence.length - errors) / currentSentence.length) * 100);
    
    showResults(wpm, accuracy, errors, timeElapsed);
    typingInput.disabled = true;
}

function showResults(wpm, accuracy, errors, time) {
    document.getElementById('final-wpm').textContent = wpm;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-errors').textContent = errors;
    document.getElementById('final-time').textContent = `${time.toFixed(1)}s`;
    
    resultsModal.classList.remove('hidden');
}

function closeResults() {
    resultsModal.classList.add('hidden');
}

function restartSentence() {
    displaySentence();
    resetStats();
    typingInput.focus();
}
