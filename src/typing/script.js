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
let testDuration = parseInt(localStorage.getItem('setTime')) || 30;
let timeRemaining = testDuration;
let timerInterval = null;
let testActive = false;

let totalCorrectChars = 0; // Track total correct characters across all sentences
let totalTypedChars = 0; // Track total characters typed
let totalErrors = 0; // Track total errors across all sentences

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
    loadTimer();
    generateNewSentence();
});

function loadTimer() {
    testDuration = parseInt(localStorage.getItem('setTime')) || 30;
    timeRemaining = testDuration;
    // Don't show timer display until test starts
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
    // Create timer display positioned at bottom left of input
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timer-display';
    timerDiv.className = 'absolute bottom-2 left-2 text-lg font-bold text-yellow-500 bg-gray-800 px-2 py-1 rounded border border-gray-600 z-10';
    timerDiv.textContent = `${timeRemaining}s`;
    
    // Position it relative to the input container
    const inputContainer = typingInput.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(timerDiv);
    
    return timerDiv;
}

function setupEventListeners() {
    // Difficulty buttons
    document.getElementById('easy-btn').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('medium-btn').addEventListener('click', () => setDifficulty('medium'));
    document.getElementById('hard-btn').addEventListener('click', () => setDifficulty('hard'));
    
    // Control buttons
    document.getElementById('new-sentence-btn').addEventListener('click', generateNewSentence);
    document.getElementById('restart-btn').addEventListener('click', restartTest);
    document.getElementById('skip-btn').addEventListener('click', generateNewSentence);
    
    // Results modal buttons
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
    
    // Typing input
    typingInput.addEventListener('input', handleTyping);
    typingInput.addEventListener('keydown', (e) => {
        // Start test on any key press (except special keys)
        if (!testActive && !startTime && e.key.length === 1) {
            startTest();
        }
    });
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Update button styles
    document.querySelectorAll('[id$="-btn"]:not(#new-sentence-btn):not(#restart-btn):not(#skip-btn)').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-200';
    });
    
    document.getElementById(`${difficulty}-btn`).className = 'px-4 py-2 rounded-lg border border-yellow-500 text-yellow-500 bg-gray-800 transition-all duration-200';
}

function startTest() {
    if (!testActive && !startTime) {
        testActive = true;
        startTime = Date.now();
        timeRemaining = testDuration;
        
        // Show timer display
        createTimerDisplay();
        
        // Start countdown timer
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            
            if (timeRemaining <= 0) {
                endTest();
            }
        }, 1000);
        
        // Remove the start instruction if present
        if (sentenceDisplay.querySelector('.text-gray-500')) {
            generateNewSentence();
        }
    }
}

function endTest() {
    testActive = false;
    clearInterval(timerInterval);
    
    // Hide timer display
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.remove();
    }
    
    // Add current input to totals if test ends mid-sentence
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
    
    // Store results in localStorage
    storeResults(wpm, accuracy, totalErrors, timeElapsed, totalTypedChars);
    
    // Show results
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
    
    // Get existing results or create empty array
    let results = JSON.parse(localStorage.getItem('typingResults')) || [];
    
    // Add new result
    results.unshift(result);
    
    // Keep only last 50 results
    if (results.length > 50) {
        results = results.slice(0, 50);
    }
    
    // Store back to localStorage
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
    
    // Update container styling for better text wrapping
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
    totalCorrectChars = 0; // Reset total counters
    totalTypedChars = 0;
    totalErrors = 0; // Reset total errors
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Remove timer display if it exists
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
    loadTimer(); // Reload timer from localStorage
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
    // Start test if not already active
    if (!testActive && !startTime) {
        startTest();
    }
    
    if (!testActive) return;
    
    const typed = typingInput.value;
    const chars = document.querySelectorAll('.char');
    
    let correctChars = 0;
    let currentErrors = 0;
    
    // Check each character typed against the sentence
    for (let i = 0; i < typed.length; i++) {
        if (i < currentSentence.length) {
            if (typed[i] === currentSentence[i]) {
                correctChars++;
            } else {
                currentErrors++;
            }
        } else {
            // Extra characters beyond sentence length count as errors
            currentErrors++;
        }
    }
    
    // Update character highlighting
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
    
    // Update progress based on time
    const progress = ((testDuration - timeRemaining) / testDuration) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    
    // Update stats
    updateStats(typed.length, correctChars, currentErrors);
    
    // Check if sentence is completed
    if (typed === currentSentence) {
        // Add the completed sentence stats to totals
        totalCorrectChars += correctChars;
        totalTypedChars += typed.length;
        totalErrors += currentErrors;
        
        // Generate new sentence and continue
        const sentenceList = sentences[currentDifficulty];
        currentSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];
        displaySentence();
        typingInput.value = ''; // Clear input for new sentence
    }
}

function updateStats(typedLength, correctChars, currentErrors) {
    if (!startTime || !testActive) return;
    
    const timeElapsed = (testDuration - timeRemaining) / 60; // minutes
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
    // Ensure modal elements exist before setting content
    const finalWpm = document.getElementById('final-wpm');
    const finalAccuracy = document.getElementById('final-accuracy');
    const finalErrors = document.getElementById('final-errors');
    const finalTime = document.getElementById('final-time');
    
    if (finalWpm) finalWpm.textContent = wpm;
    if (finalAccuracy) finalAccuracy.textContent = `${accuracy}%`;
    if (finalErrors) finalErrors.textContent = errors;
    if (finalTime) finalTime.textContent = `${time}s`;
    
    // Force show the modal
    if (resultsModal) {
        resultsModal.style.display = 'flex';
        resultsModal.classList.remove('hidden');
        console.log('Results modal should be visible now'); // Debug log
    }
}

function closeResults() {
    if (resultsModal) {
        resultsModal.style.display = 'none';
        resultsModal.classList.add('hidden');
    }
}
