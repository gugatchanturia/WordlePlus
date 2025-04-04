# WordlePlus

## Overview
WordlePlus is an enhanced version of the popular Wordle game, featuring multiple difficulty levels and an intelligent word validation system. The game engine is built with Python and includes a sophisticated database management system for word storage and validation.

## Features
- **Multiple Difficulty Levels**: Choose between 3, 5, or 7 letter words
- **Intelligent Word Validation**: Uses both local database and AI-powered validation
- **Hint System**: Get helpful hints using OpenAI's GPT model
- **Self-Improving Database**: Automatically adds new valid words to the database
- **Performance Tracking**: Tracks attempts and time taken to solve
- **User-Friendly Interface**: Clear feedback with visual indicators

## Project Structure
```
GameEngine/
├── Database.py       # Database management system
├── Logic.py          # Core game logic and flow
├── CheckWord.py      # Word validation functionality
├── Hint.py           # AI-powered hint generation
├── three_letter_words.json  # Easy mode dictionary
├── five_letter_words.json   # Medium mode dictionary
├── seven_letter_words.json  # Hard mode dictionary
├── .env              # Environment variables (API keys)
└── LastUpdate.txt    # Development history
```

## Components

### Database Management System (Database.py)
The Database.py module serves as the core data management system for the WordlePlus game, handling:
- Word storage and retrieval
- Persistent data management using JSON files
- Dynamic word dictionary updates
- Memory-efficient word storage

#### Key Functions
- `load_words()`: Loads all word dictionaries from JSON files into memory
- `addToDictionary(word, file_path)`: Adds new words to the appropriate dictionary file

### Game Logic (Logic.py)
The Logic.py module serves as the core game engine for WordlePlus, implementing:
- Game flow and user interaction
- Word guessing mechanics
- Difficulty level selection
- Score tracking and timing
- Hint system integration

#### Game Flow
1. **Initialization**: Loads word dictionaries and initializes game variables
2. **Difficulty Selection**: Choose between 3, 5, or 7 letter words
3. **Game Loop**: 
   - Accepts user input
   - Validates words
   - Provides feedback using symbols:
     - `*`: Correct letter in correct position
     - `^`: Correct letter in wrong position
     - `‾`: Letter not in word
   - Tracks attempts and time
   - Handles special commands:
     - `igiveup`: Reveals the word
     - `givemeahint`: Provides a hint (one-time use)
4. **Game Completion**: Displays victory message with time and attempts

### Word Validation (CheckWord.py)
The CheckWord.py module handles word validation with a two-step process:
1. **Local Database Check**: Checks if the word exists in the local JSON dictionaries
2. **AI Validation**: If not found locally, uses OpenAI to validate the word
   - If valid, adds the word to the appropriate dictionary for future use
   - This creates a self-improving database that grows over time

### Hint System (Hint.py)
The Hint.py module provides AI-powered hints using OpenAI's GPT model:
- Generates contextual hints for the target word
- Hints are designed to be challenging but helpful
- Limited to one hint per game to maintain challenge

## How to Play
1. Run the game by executing `python Logic.py` in the GameEngine directory
2. Select a difficulty level (3, 5, or 7 letter words)
3. Guess the word by entering a word of the appropriate length
4. Use the feedback to guide your next guess:
   - `*`: Letter is correct and in the right position
   - `^`: Letter is in the word but in the wrong position
   - `‾`: Letter is not in the word
5. Special commands:
   - Type `givemeahint` to get a hint (one-time use)
   - Type `igiveup` to reveal the word and end the game
6. Continue playing or exit when finished

## Installation
1. Clone the repository
2. Install required dependencies:
   ```
   pip install openai python-dotenv
   ```
3. Create a `.env` file in the GameEngine directory with your OpenAI API key:
   ```
   API_KEY=your_openai_api_key_here
   ```
4. Run the game:
   ```
   cd GameEngine
   python Logic.py
   ```

## Dependencies
- Python 3.x
- openai: For AI-powered word validation and hints
- python-dotenv: For environment variable management
- json: For database management (standard library)
- os: For file operations (standard library)

## Recent Updates
- **27.03.2025**: Implemented two-step word validation with AI integration
- **28.03.2025**: Fixed case sensitivity issues in word comparison

## Best Practices
1. Always call `load_words()` before accessing the dictionaries
2. Use lowercase words when adding to the dictionary
3. Ensure proper file permissions for JSON files
4. Handle potential file operation errors in the calling code

## Notes
- The system is designed to be extensible for additional word lengths
- JSON files are automatically created if they don't exist
- All words are stored in lowercase for consistent comparison
- The system includes built-in error handling for file operations
- The database self-improves by adding new valid words over time 