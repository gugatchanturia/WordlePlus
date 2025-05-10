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
    data = request.get_json()
    difficulty = data.get('difficulty')
    
    if not difficulty or difficulty not in [3, 5, 7]:
        return jsonify({'error': 'Invalid difficulty level'}), 400
    
    # Load words based on difficulty
    words = load_words()
    word_list = []
    
    if difficulty == 3:
        word_list = list(words.three_letter_words.keys())
    elif difficulty == 5:
        word_list = list(words.five_letter_words.keys())
    else:
        word_list = list(words.seven_letter_words.keys())
    
    if not word_list:
        return jsonify({'error': 'No words available for this difficulty'}), 400
    
    # Select a random word
    game_state['current_word'] = random.choice(word_list)
    game_state['difficulty'] = difficulty
    game_state['start_time'] = time.time()
    game_state['attempts'] = 0
    game_state['hint_used'] = False
    
    return jsonify({'word': game_state['current_word']})

@app.route('/api/check-guess', methods=['POST'])
def check_guess():
    if not game_state['current_word']:
        return jsonify({'error': 'No active game'}), 400
    
    data = request.get_json()
    guess = data.get('guess', '').lower()
    
    if not guess:
        return jsonify({'error': 'No guess provided'}), 400
    
    if len(guess) != game_state['difficulty']:
        return jsonify({'error': f'Guess must be {game_state["difficulty"]} letters long'}), 400
    
    if not isValidWord(guess, game_state['difficulty']):
        return jsonify({'error': 'Invalid word'}), 400
    
    game_state['attempts'] += 1
    
    if guess == game_state['current_word']:
        return jsonify({
            'status': 'win',
            'message': 'Congratulations! You guessed the word correctly!'
        })
    
    # Generate feedback
    feedback = ['_'] * len(guess)
    remaining = list(game_state['current_word'])
    
    # First pass: mark correct letters
    for i in range(len(guess)):
        if guess[i] == game_state['current_word'][i]:
            feedback[i] = '*'
            remaining.remove(guess[i])
    
    # Second pass: mark partial matches
    for i in range(len(guess)):
        if feedback[i] == '_' and guess[i] in remaining:
            feedback[i] = '^'
            remaining.remove(guess[i])
    
    return jsonify({
        'status': 'continue',
        'feedback': ''.join(feedback)
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
        'word': game_state['current_word'],
        'message': f'Game over! The word was {game_state["current_word"]}'
    })

if __name__ == '__main__':
    app.run(debug=True) 