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
    currentHint: '',
    isLoading: false,  // Add loading state
    startTime: null
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
const endgameModal = document.getElementById('endgame-modal');
const endgameTitle = document.getElementById('endgame-title');
const endgameResult = document.getElementById('endgame-result');
const endgameTime = document.getElementById('endgame-time');
const endgameAttempts = document.getElementById('endgame-attempts');
const restartSameModeBtn = document.getElementById('restart-same-mode');
const restartNewModeBtn = document.getElementById('restart-new-mode');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name');
const leaderboardList = document.getElementById('leaderboard-list');
const difficultyTabs = document.querySelectorAll('.difficulty-tab');
const leaderboardLists = document.querySelectorAll('.leaderboard-list');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
const indicators = document.querySelectorAll('.indicator');
const dots = document.querySelectorAll('.dot');
let deviceId = localStorage.getItem('deviceId') || generateDeviceId();
let currentLeaderboardIndex = 1; // Start with 5-letter leaderboard
const difficulties = ['3', '5', '7'];
let autoTransitionInterval;

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    // Show leaderboard only on welcome screen
    const leaderboardSection = document.getElementById('leaderboard-section');
    if (sectionId === 'welcome-section') {
        leaderboardSection.classList.remove('hidden');
        // Reset to 5-letter leaderboard and load data
        currentLeaderboardIndex = 1;
        updateCarousel(0, 1);
        loadAllLeaderboards();
        startAutoTransition();
    } else {
        leaderboardSection.classList.add('hidden');
        stopAutoTransition();
    }
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

    // Add event listeners for hint tooltip
    hintBtn.addEventListener('mouseenter', () => {
        if (gameState.hintUsed) {
            hintTooltip.style.visibility = 'visible';
            hintTooltip.style.opacity = '1';
        }
    });

    hintBtn.addEventListener('mouseleave', () => {
        hintTooltip.style.visibility = 'hidden';
        hintTooltip.style.opacity = '0';
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Add event listeners for restart buttons
    restartSameModeBtn.addEventListener('click', () => {
        endgameModal.classList.remove('show');
        startGame(gameState.difficulty);
    });

    restartNewModeBtn.addEventListener('click', () => {
        endgameModal.classList.remove('show');
        showSection('difficulty-section');
    });

    // Add dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            navigateLeaderboard(index);
            stopAutoTransition();
            startAutoTransition();
        });
    });

    // Initialize carousel with 5-letter leaderboard and load data
    updateCarousel(0, 1);
    loadAllLeaderboards();
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
                currentHint: '',
                isLoading: false,
                startTime: new Date()
            };

            // Hide all sections except game section
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('hidden');
            });
            gameSection.classList.remove('hidden');
            
            guessHistory.innerHTML = '';
            
            // Reset hint button
            hintBtn.classList.remove('lit');
            hintTooltip.textContent = 'Click to get a hint';
            
            // Reset keyboard colors
            const keys = keyboard.querySelectorAll('.key');
            keys.forEach(key => {
                key.classList.remove('correct', 'partial', 'incorrect');
                key.style.backgroundColor = '';
                key.style.color = '';
            });
            
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
    if (gameState.gameOver || gameState.isLoading) return;

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
        // Set loading state
        gameState.isLoading = true;
        showToast('Validating word...', 'info');
        disableInput();

        const response = await fetch('/api/check-guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guess })
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
                
                showEndgameModal(true);
                return;
            }
            
            // Create feedback array for the keyboard
            const result = data.feedback.split('').map(f => {
                if (f === '*') return 'correct';
                if (f === '^') return 'partial';
                return 'incorrect';
            });
            
            updateGuessHistory(guess, result);
            updateKeyboardState(guess, result);
            
            // Reset current guess and update grid
            gameState.currentGuess = '';
            updateCurrentGuessGrid();
            
            if (gameState.guesses.length >= gameState.maxGuesses) {
                gameState.gameOver = true;
                showEndgameModal(false);
            }
        } else {
            if (data.error === 'Invalid word') {
                showToast('Word may not exist', 'error');
                gameState.currentGuess = '';
                updateCurrentGuessGrid();
            } else {
                showToast(data.error, 'error');
            }
        }
    } catch (error) {
        showToast('Error checking guess. Please try again.', 'error');
    } finally {
        // Reset loading state
        gameState.isLoading = false;
        enableInput();
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
    if (gameState.gameOver || gameState.isLoading) return;

    try {
        gameState.isLoading = true;
        disableInput();

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
    } finally {
        gameState.isLoading = false;
        enableInput();
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
            showEndgameModal(false);
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
        currentHint: '',
        isLoading: false,
        startTime: null
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

// Add functions to handle input state
function disableInput() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = true;
    });
    document.removeEventListener('keydown', handlePhysicalKeyPress);
}

function enableInput() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
    });
    document.addEventListener('keydown', handlePhysicalKeyPress);
}

// Add this new function to show the endgame modal
async function showEndgameModal(isWin) {
    const endTime = new Date();
    const timeSpent = (endTime - gameState.startTime) / 1000;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = Math.floor(timeSpent % 60);
    
    endgameTitle.textContent = isWin ? 'You Win!' : 'Game Over!';
    endgameResult.textContent = isWin 
        ? `Congratulations! You guessed the word "${gameState.targetWord}" correctly!`
        : `The word was "${gameState.targetWord}". Better luck next time!`;
    endgameTime.textContent = `Time: ${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
    endgameAttempts.textContent = `Attempts: ${gameState.guesses.length}/${gameState.maxGuesses}`;
    
    // Show endgame modal
    endgameModal.classList.add('show');
    
    // Show leaderboard section with current difficulty
    const leaderboardSection = document.getElementById('leaderboard-section');
    leaderboardSection.classList.remove('hidden');
    
    // Find the index of the current difficulty
    const difficultyIndex = difficulties.indexOf(gameState.difficulty.toString());
    if (difficultyIndex !== -1) {
        currentLeaderboardIndex = difficultyIndex;
        updateCarousel(0, difficultyIndex);
    }
    
    // If game was won, handle score saving
    if (isWin) {
        const userName = await checkUserName();
        if (!userName) {
            // Show name input modal
            nameModal.classList.add('show');
        } else {
            // Save score directly
            await saveScore(gameState.difficulty, timeSpent);
            await updateLeaderboard(gameState.difficulty);
        }
    }
}

// Add this function to generate a unique device ID
function generateDeviceId() {
    const id = 'device_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', id);
    return id;
}

// Add this function to check if user has a name
async function checkUserName() {
    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'X-Device-ID': deviceId
            }
        });
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error('Error checking user name:', error);
        return null;
    }
}

// Add this function to save user name
async function saveUserName(name) {
    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Device-ID': deviceId
            },
            body: JSON.stringify({ name })
        });
        const data = await response.json();
        return data.message === 'Name saved successfully';
    } catch (error) {
        console.error('Error saving user name:', error);
        return false;
    }
}

// Add this function to update leaderboard
async function updateLeaderboard(difficulty) {
    try {
        const response = await fetch(`/api/leaderboard?difficulty=${difficulty}`);
        const data = await response.json();
        
        if (response.ok) {
            const leaderboardList = document.getElementById(`leaderboard-${difficulty}`);
            if (!leaderboardList) return;

            if (!data.scores || data.scores.length === 0) {
                leaderboardList.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first to play!</div>';
                return;
            }

            leaderboardList.innerHTML = '';
            data.scores.forEach((score, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = `
                    <span class="rank">#${index + 1}</span>
                    <span class="player">${score.name}</span>
                    <span class="time">${formatTime(score.time)}</span>
                    <span class="date">${score.date}</span>
                `;
                leaderboardList.appendChild(item);
            });
        } else {
            console.error('Failed to load leaderboard:', data.error);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Add this function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

// Add this function to save score
async function saveScore(difficulty, time) {
    try {
        const response = await fetch('/api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Device-ID': deviceId
            },
            body: JSON.stringify({
                difficulty,
                time
            })
        });
        const data = await response.json();
        return data.message === 'Score added successfully';
    } catch (error) {
        console.error('Error saving score:', error);
        return false;
    }
}

// Add event listener for save name button
saveNameBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (name) {
        const success = await saveUserName(name);
        if (success) {
            nameModal.classList.remove('show');
            const timeSpent = (new Date() - gameState.startTime) / 1000;
            await saveScore(gameState.difficulty, timeSpent);
            await updateLeaderboard(gameState.difficulty);
        } else {
            showToast('Error saving name. Please try again.', 'error');
        }
    } else {
        showToast('Please enter a name', 'error');
    }
});

// Add event listener for name input enter key
nameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        saveNameBtn.click();
    }
});

// Add this function to switch between difficulty tabs
function switchDifficultyTab(difficulty) {
    // Update active tab
    difficultyTabs.forEach(tab => {
        if (tab.dataset.difficulty === difficulty) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update active leaderboard list
    leaderboardLists.forEach(list => {
        if (list.id === `leaderboard-${difficulty}`) {
            list.classList.add('active');
        } else {
            list.classList.remove('active');
        }
    });

    // Update the leaderboard content
    updateLeaderboard(difficulty);
}

// Add event listeners for difficulty tabs
difficultyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchDifficultyTab(tab.dataset.difficulty);
    });
});

// Update the navigateLeaderboard function
function navigateLeaderboard(index) {
    if (index < 0 || index >= difficulties.length) return;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Update leaderboard visibility
    leaderboardLists.forEach((list, i) => {
        list.classList.toggle('active', i === index);
    });
    
    currentLeaderboardIndex = index;
}

// Update the updateCarousel function
function updateCarousel(prevIndex, newIndex) {
    // Update dots
    dots[prevIndex].classList.remove('active');
    dots[newIndex].classList.add('active');
    
    // Update leaderboard visibility
    leaderboardLists[prevIndex].classList.remove('active');
    leaderboardLists[newIndex].classList.add('active');
    
    currentLeaderboardIndex = newIndex;
}

// Add this function to start auto-transition
function startAutoTransition() {
    stopAutoTransition(); // Clear any existing interval
    autoTransitionInterval = setInterval(() => {
        const nextIndex = (currentLeaderboardIndex + 1) % difficulties.length;
        navigateLeaderboard(nextIndex);
    }, 5000); // Change every 5 seconds
}

// Add this function to stop auto-transition
function stopAutoTransition() {
    if (autoTransitionInterval) {
        clearInterval(autoTransitionInterval);
    }
}

// Add this new function to load all leaderboards
async function loadAllLeaderboards() {
    for (const difficulty of difficulties) {
        await updateLeaderboard(difficulty);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame); 