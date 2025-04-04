let currentDifficulty = null;

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

function showMessage(message, isError = false) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message ${isError ? 'error' : 'success'}`;
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

async function startGame(difficulty) {
    currentDifficulty = difficulty;
    
    try {
        const response = await fetch('/api/start-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ difficulty })
        });
        
        if (!response.ok) {
            throw new Error('Failed to start game');
        }
        
        showSection('game-board');
        document.getElementById('guess-input').maxLength = difficulty;
        document.getElementById('guess-input').value = '';
        document.getElementById('guess-history').innerHTML = '';
        updateAttempts(0);
        showMessage('');
        
    } catch (error) {
        showMessage('Failed to start game. Please try again.', true);
    }
}

async function submitGuess() {
    const input = document.getElementById('guess-input');
    const word = input.value.toLowerCase();
    
    if (!word) {
        showMessage('Please enter a word', true);
        return;
    }
    
    try {
        const response = await fetch('/api/guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit guess');
        }
        
        if (data.status === 'win') {
            showGameOver(data.message, true);
        } else {
            const guessHistory = document.getElementById('guess-history');
            guessHistory.appendChild(createGuessRow(word, data.feedback));
            updateAttempts(data.attempts);
            input.value = '';
            showMessage('');
        }
        
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function getHint() {
    try {
        const response = await fetch('/api/hint');
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get hint');
        }
        
        showMessage(`Hint: ${data.hint}`);
        document.getElementById('hint-btn').disabled = true;
        
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function giveUp() {
    try {
        const response = await fetch('/api/give-up', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to give up');
        }
        
        showGameOver(`The word was: ${data.word}`, false);
        
    } catch (error) {
        showMessage(error.message, true);
    }
}

function showGameOver(message, isWin) {
    document.getElementById('game-over-message').textContent = message;
    showSection('game-over');
}

function resetGame() {
    showSection('game-setup');
    currentDifficulty = null;
}

// Event Listeners
document.getElementById('guess-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitGuess();
    }
}); 