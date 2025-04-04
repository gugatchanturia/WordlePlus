# WordlePlus

WordlePlus is an enhanced version of the popular word-guessing game Wordle, with multiple difficulty levels and an intelligent word validation system. The game features a modern web interface with a virtual keyboard, dark mode, and AI-powered hints.

![WordlePlus Screenshot](screenshot.png)

## Features

- **Multiple Difficulty Levels**: Choose between 3, 5, or 7 letter words
- **Virtual Keyboard**: Input your guesses using the on-screen keyboard
- **Intelligent Word Validation**: Uses both local database and AI-powered validation
- **Hint System**: Get helpful hints using OpenAI's GPT model
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Play on desktop or mobile devices
- **Visual Feedback**: Clear visual indicators for correct, partial, and incorrect letters
- **Toast Notifications**: Non-intrusive notifications for game events

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **AI Integration**: OpenAI API for word validation and hints
- **Database**: JSON-based word storage system

## Project Structure

```
wordleplus/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css       # Stylesheet
│   └── js/
│       └── game.js         # Game logic
├── templates/
│   └── index.html          # Main HTML template
└── GameEngine/
    ├── Database.py         # Database management system
    ├── CheckWord.py        # Word validation functionality
    ├── Hint.py             # AI-powered hint generation
    ├── Logic.py            # Core game logic
    ├── three_letter_words.json  # Easy mode dictionary
    ├── five_letter_words.json   # Medium mode dictionary
    ├── seven_letter_words.json  # Hard mode dictionary
    └── .env                # Environment variables (API keys)
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wordleplus.git
   cd wordleplus
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the GameEngine directory with your OpenAI API key:
   ```
   API_KEY=your_openai_api_key_here
   ```

5. Run the application:
   ```
   python app.py
   ```

6. Open your browser and navigate to `http://localhost:5000`

## How to Play

1. **Start the Game**: Click the "Play" button on the welcome screen
2. **Select Difficulty**: Choose a word length (3, 5, or 7 letters)
3. **Make Guesses**: Type your guess using the virtual keyboard or your physical keyboard
4. **Submit Guess**: Press Enter or click the Enter button on the virtual keyboard
5. **Use Hints**: Click the light bulb icon to get a hint (available once per game)
6. **Give Up**: Click the "Give Up" button if you want to see the answer
7. **Reset Game**: Click the "Reset" button to start a new game

## Color Indicators

- **Green**: Letter is correct and in the right position
- **Yellow**: Letter is in the word but in the wrong position
- **Gray**: Letter is not in the word

## Game Engine Components

### Database Management System (Database.py)
- Handles word storage and retrieval
- Uses JSON files for persistent data management
- Provides functions to load words and add new words to dictionaries

### Word Validation (CheckWord.py)
- Validates user guesses against the database
- Uses OpenAI API to validate words not found in the database
- Automatically adds new valid words to the appropriate dictionary

### Hint System (Hint.py)
- Generates contextual hints using OpenAI's GPT model
- Provides challenging but helpful hints to guide the player
- Limited to one hint per game to maintain challenge

## Customization

- **Theme**: Toggle between light and dark mode using the switch in the top-right corner
- **Difficulty**: Choose different word lengths for varying challenge levels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle) game
- Word lists sourced from various public domain dictionaries 