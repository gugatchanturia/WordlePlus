from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
import random
import time
from GameEngine.Database import load_words, addToDictionary
from GameEngine.CheckWord import isValidWord
from GameEngine.Hint import Hint

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Load environment variables
load_dotenv()

# Initialize game state
game_state = {
    'current_word': None,
    'difficulty': None,
    'start_time': None,
    'attempts': 0,
    'hint_used': False
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start-game', methods=['POST'])
def start_game():
    data = request.json
    difficulty = data.get('difficulty')
    
    # Load words
    words = load_words()
    
    # Select random word based on difficulty
    if difficulty == 3:
        word = random.choice(list(words.three_letter_words.keys()))
    elif difficulty == 5:
        word = random.choice(list(words.five_letter_words.keys()))
    elif difficulty == 7:
        word = random.choice(list(words.seven_letter_words.keys()))
    else:
        return jsonify({'error': 'Invalid difficulty'}), 400
    
    # Reset game state
    game_state['current_word'] = word
    game_state['difficulty'] = difficulty
    game_state['start_time'] = time.time()
    game_state['attempts'] = 0
    game_state['hint_used'] = False
    
    return jsonify({'message': 'Game started'})

@app.route('/api/guess', methods=['POST'])
def guess():
    data = request.json
    guess_word = data.get('word', '').lower()
    
    if not game_state['current_word']:
        return jsonify({'error': 'No active game'}), 400
    
    if len(guess_word) != game_state['difficulty']:
        return jsonify({'error': f'Word must be {game_state["difficulty"]} letters long'}), 400
    
    if not isValidWord(guess_word, game_state['difficulty']):
        return jsonify({'error': 'Invalid word'}), 400
    
    game_state['attempts'] += 1
    
    # Check if word matches
    if guess_word == game_state['current_word']:
        end_time = time.time()
        time_taken = end_time - game_state['start_time']
        return jsonify({
            'status': 'win',
            'message': f'Congratulations! You guessed the word in {game_state["attempts"]} attempts and {time_taken:.2f} seconds!',
            'word': game_state['current_word']
        })
    
    # Generate feedback
    feedback = ['‾'] * game_state['difficulty']
    remaining = {}
    for char in game_state['current_word']:
        remaining[char] = remaining.get(char, 0) + 1
    
    # Check for correct letters in correct positions
    for i in range(game_state['difficulty']):
        if guess_word[i] == game_state['current_word'][i]:
            feedback[i] = '*'
            remaining[guess_word[i]] -= 1
    
    # Check for correct letters in wrong positions
    for i in range(game_state['difficulty']):
        if feedback[i] == '‾' and guess_word[i] in remaining and remaining[guess_word[i]] > 0:
            feedback[i] = '^'
            remaining[guess_word[i]] -= 1
    
    return jsonify({
        'status': 'continue',
        'feedback': feedback,
        'attempts': game_state['attempts']
    })

@app.route('/api/hint', methods=['GET'])
def get_hint():
    if not game_state['current_word']:
        return jsonify({'error': 'No active game'}), 400
    
    if game_state['hint_used']:
        return jsonify({'error': 'Hint already used'}), 400
    
    game_state['hint_used'] = True
    hint = Hint(game_state['current_word'])
    return jsonify({'hint': hint})

@app.route('/api/give-up', methods=['POST'])
def give_up():
    if not game_state['current_word']:
        return jsonify({'error': 'No active game'}), 400
    
    return jsonify({
        'status': 'give-up',
        'word': game_state['current_word']
    })

if __name__ == '__main__':
    app.run(debug=True) 