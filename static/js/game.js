let currentDifficulty = null;

// Game state
let gameState = {
    difficulty: null,
    targetWord: '',
    guesses: [],
    gameOver: false,
    maxGuesses: 6,
    currentGuess: '',
    currentRow: 0,
    hintUsed: false,
    currentHint: ''
};

// DOM elements
const welcomeSection = document.getElementById('welcome-section');
const difficultySection = document.getElementById('difficulty-section');
const gameSection = document.getElementById('game-section');
const hintBtn = document.getElementById('hint-btn');
const giveUpBtn = document.getElementById('give-up-btn');
const resetBtn = document.getElementById('reset-btn');
const guessHistory = document.getElementById('guess-history');
const keyboard = document.querySelector('.virtual-keyboard');
const currentGuessGrid = document.getElementById('current-guess-grid');
const themeToggle = document.getElementById('checkbox');
const hintTooltip = document.querySelector('.hint-tooltip');
const toast = document.getElementById('toast');

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function showMessage(message, isError = false) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
}

function updateAttempts(attempts) {
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
}

function createGuessRow(word, feedback) {
    const row = document.createElement('div');
    row.className = 'guess-row';
    
    for (let i = 0; i < word.length; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = word[i].toUpperCase();
        
        if (feedback[i] === '*') {
            letter.classList.add('correct');
        } else if (feedback[i] === '^') {
            letter.classList.add('partial');
        } else {
            letter.classList.add('incorrect');
        }
        
        row.appendChild(letter);
    }
    
    return row;
}

// Initialize the game
function initGame() {
    // Add event listener for play button
    document.getElementById('play-btn').addEventListener('click', showDifficultyScreen);

    // Add event listeners for difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => startGame(btn.dataset.difficulty));
    });

    // Add event listeners for game buttons
    hintBtn.addEventListener('click', getHint);
    giveUpBtn.addEventListener('click', giveUp);
    resetBtn.addEventListener('click', resetGame);

    // Add event listeners for virtual keyboard
    keyboard.addEventListener('click', handleKeyPress);

    // Add event listener for physical keyboard
    document.addEventListener('keydown', handlePhysicalKeyPress);

    // Add event listener for theme toggle
    themeToggle.addEventListener('change', toggleTheme);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
}

// Toggle dark/light theme
function toggleTheme() {
    if (themeToggle.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Show difficulty selection screen
function showDifficultyScreen() {
    welcomeSection.classList.add('hidden');
    difficultySection.classList.remove('hidden');
}

// Start a new game
async function startGame(difficulty) {
    try {
        const response = await fetch('/api/start-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ difficulty: parseInt(difficulty) })
        });

        const data = await response.json();
        
        if (response.ok) {
            gameState = {
                difficulty: parseInt(difficulty),
                targetWord: data.word || '',
                guesses: [],
                gameOver: false,
                maxGuesses: 6,
                currentGuess: '',
                currentRow: 0,
                hintUsed: false,
                currentHint: ''
            };

            difficultySection.classList.add('hidden');
            gameSection.classList.remove('hidden');
            guessHistory.innerHTML = '';
            
            // Reset hint button
            hintBtn.classList.remove('lit');
            hintTooltip.textContent = 'Click to get a hint';
            
            // Create the current guess grid
            createCurrentGuessGrid();
        } else {
            showToast(data.error, 'error');
        }
    } catch (error) {
        showToast('Error starting game. Please try again.', 'error');
    }
}

// Create the current guess grid
function createCurrentGuessGrid() {
    currentGuessGrid.innerHTML = '';
    for (let i = 0; i < gameState.difficulty; i++) {
        const cell = document.createElement('div');
        cell.className = 'guess-cell';
        cell.dataset.index = i;
        currentGuessGrid.appendChild(cell);
    }
    updateCurrentGuessGrid();
}

// Update the current guess grid
function updateCurrentGuessGrid() {
    const cells = currentGuessGrid.querySelectorAll('.guess-cell');
    cells.forEach((cell, index) => {
        if (index < gameState.currentGuess.length) {
            cell.textContent = gameState.currentGuess[index].toUpperCase();
            cell.classList.add('filled');
        } else {
            cell.textContent = '';
            cell.classList.remove('filled');
        }
        
        if (index === gameState.currentGuess.length) {
            cell.classList.add('active');
        } else {
            cell.classList.remove('active');
        }
    });
}

// Submit a guess
async function submitGuess() {
    if (gameState.gameOver) return;

    const guess = gameState.currentGuess;
    
    if (!guess) {
        showToast('Please enter a guess', 'error');
        return;
    }

    if (guess.length !== gameState.difficulty) {
        showToast(`Please enter a ${gameState.difficulty}-letter word`, 'error');
        return;
    }

    try {
        const response = await fetch('/api/guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: guess })
        });

        const data = await response.json();
        
        if (response.ok) {
            gameState.guesses.push(guess);
            
            if (data.status === 'win') {
                gameState.gameOver = true;
                
                // Create feedback array for the keyboard - all correct
                const result = Array(guess.length).fill('correct');
                
                // Update the guess history with all correct letters
                updateGuessHistory(guess, result);
                
                // Update all keyboard keys to correct
                updateKeyboardState(guess, result);
                
                // Update the current guess grid to show all correct
                updateCurrentGuessGridWin();
                
                showToast(data.message, 'success');
                return;
            }
            
            // Create feedback array for the keyboard
            const result = [];
            for (let i = 0; i < data.feedback.length; i++) {
                if (data.feedback[i] === '*') {
                    result.push('correct');
                } else if (data.feedback[i] === '^') {
                    result.push('partial');
                } else {
                    result.push('incorrect');
                }
            }
            
            updateGuessHistory(guess, result);
            updateKeyboardState(guess, result);
            
            // Reset current guess and update grid
            gameState.currentGuess = '';
            updateCurrentGuessGrid();
            
            if (gameState.guesses.length >= gameState.maxGuesses) {
                gameState.gameOver = true;
                showToast(`Game Over! The word was ${data.word}`, 'error');
            }
        } else {
            showToast(data.error, 'error');
        }
    } catch (error) {
        showToast('Error checking guess. Please try again.', 'error');
    }
}

// Update the current guess grid for a win
function updateCurrentGuessGridWin() {
    const cells = currentGuessGrid.querySelectorAll('.guess-cell');
    cells.forEach((cell, index) => {
        if (index < gameState.currentGuess.length) {
            cell.textContent = gameState.currentGuess[index].toUpperCase();
            cell.classList.add('filled', 'correct');
        } else {
            cell.textContent = '';
            cell.classList.remove('filled', 'active');
        }
    });
}

// Get a hint
async function getHint() {
    if (gameState.gameOver) return;

    try {
        const response = await fetch('/api/hint', {
            method: 'GET'
        });

        const data = await response.json();
        
        if (response.ok) {
            // Light up the hint button
            hintBtn.classList.add('lit');
            gameState.hintUsed = true;
            gameState.currentHint = data.hint;
            
            // Update the tooltip with the hint
            hintTooltip.textContent = data.hint;
            
            // Show a brief toast notification
            showToast('Hint received! Hover over the light bulb to see it.', 'success');
        } else {
            showToast(data.error, 'error');
        }
    } catch (error) {
        showToast('Error getting hint. Please try again.', 'error');
    }
}

// Give up
async function giveUp() {
    if (gameState.gameOver) return;
    
    try {
        const response = await fetch('/api/give-up', {
            method: 'POST'
        });

        const data = await response.json();
        
        if (response.ok) {
            gameState.gameOver = true;
            showToast(`Game Over! The word was ${data.word}`, 'error');
        } else {
            showToast(data.error, 'error');
        }
    } catch (error) {
        showToast('Error giving up. Please try again.', 'error');
    }
}

// Reset the game
function resetGame() {
    gameState = {
        difficulty: null,
        targetWord: '',
        guesses: [],
        gameOver: false,
        maxGuesses: 6,
        currentGuess: '',
        currentRow: 0,
        hintUsed: false,
        currentHint: ''
    };

    welcomeSection.classList.remove('hidden');
    difficultySection.classList.add('hidden');
    gameSection.classList.add('hidden');
    guessHistory.innerHTML = '';
    
    // Reset hint button
    hintBtn.classList.remove('lit');
    hintTooltip.textContent = 'Click to get a hint';
}

// Update the guess history display
function updateGuessHistory(guess, result) {
    const row = document.createElement('div');
    row.className = 'guess-row';

    for (let i = 0; i < guess.length; i++) {
        const letter = document.createElement('div');
        letter.className = `letter ${result[i]}`;
        letter.textContent = guess[i].toUpperCase();
        row.appendChild(letter);
    }

    guessHistory.appendChild(row);
}

// Handle virtual keyboard key press
function handleKeyPress(event) {
    if (gameState.gameOver) return;

    const key = event.target;
    if (!key.classList.contains('key')) return;

    const keyValue = key.dataset.key;

    if (keyValue === 'enter') {
        submitGuess();
    } else if (keyValue === 'backspace') {
        if (gameState.currentGuess.length > 0) {
            gameState.currentGuess = gameState.currentGuess.slice(0, -1);
            updateCurrentGuessGrid();
        }
    } else {
        if (gameState.currentGuess.length < gameState.difficulty) {
            gameState.currentGuess += keyValue.toLowerCase();
            updateCurrentGuessGrid();
        }
    }
}

// Handle physical keyboard key press
function handlePhysicalKeyPress(event) {
    if (gameState.gameOver) return;

    if (event.key === 'Enter') {
        submitGuess();
    } else if (event.key === 'Backspace') {
        if (gameState.currentGuess.length > 0) {
            gameState.currentGuess = gameState.currentGuess.slice(0, -1);
            updateCurrentGuessGrid();
        }
    } else if (/^[a-zA-Z]$/.test(event.key)) {
        if (gameState.currentGuess.length < gameState.difficulty) {
            gameState.currentGuess += event.key.toLowerCase();
            updateCurrentGuessGrid();
        }
    }
}

// Update keyboard state based on guess result
function updateKeyboardState(guess, result) {
    for (let i = 0; i < guess.length; i++) {
        const key = document.querySelector(`.key[data-key="${guess[i].toUpperCase()}"]`);
        if (key) {
            const currentState = key.className.split(' ').find(c => ['correct', 'partial', 'incorrect'].includes(c));
            
            if (!currentState || (result[i] === 'correct' && currentState !== 'correct') ||
                (result[i] === 'partial' && currentState === 'incorrect')) {
                key.className = `key ${result[i]}`;
            }
        }
    }
}

// Reset keyboard state
function resetKeyboardState() {
    document.querySelectorAll('.key').forEach(key => {
        key.className = 'key';
    });
}

// Show a toast notification
function showToast(text, type) {
    toast.textContent = text;
    toast.className = `toast ${type} show`;
    
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame); 