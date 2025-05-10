# WordlePlus Documentation

## Introduction

WordlePlus is a modern web-based word-guessing game inspired by the popular Wordle game. This documentation will guide you through understanding and working with the project.

## Project Overview

### What is WordlePlus?
WordlePlus is a word-guessing game where players try to guess a hidden word within a limited number of attempts. The game features:
- Multiple difficulty levels (3, 5, and 7 letter words)
- Real-time feedback on guesses
- A hint system
- Leaderboard tracking
- Dark/Light theme support
- Responsive design for all devices

### Technical Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **Data Storage**: JSON files
- **Containerization**: Docker

## Project Structure

```
wordleplus/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css      # Stylesheet
│   └── js/
│       └── game.js        # Game logic
├── templates/
│   └── index.html         # Main HTML template
├── GameEngine/
│   ├── Database.py        # Database management
│   ├── CheckWord.py       # Word validation
│   ├── Hint.py           # Hint generation
│   ├── Logic.py          # Core game logic
│   └── word_lists/       # Word dictionaries
├── data/                  # Game data storage
│   ├── leaderboard.json  # Leaderboard data
│   └── users.json        # User data
└── screenshots/          # Project screenshots
```

## Key Components

### 1. Game Engine
The game engine consists of several Python modules:

#### Database.py
- Manages word storage and retrieval
- Handles leaderboard and user data
- Uses JSON files for data persistence

#### CheckWord.py
- Validates user guesses
- Checks if words exist in the dictionary
- Provides feedback on guess accuracy

#### Hint.py
- Generates helpful hints for players
- Uses word patterns and common letter combinations
- Provides contextual hints based on previous guesses

#### Logic.py
- Implements core game mechanics
- Manages game state
- Handles win/loss conditions

### 2. Frontend

#### HTML (index.html)
- Main game interface
- Responsive layout
- Virtual keyboard
- Game grid

#### CSS (style.css)
- Modern, clean design
- Dark/Light theme support
- Responsive design
- Animations and transitions

#### JavaScript (game.js)
- Game state management
- User input handling
- API communication
- UI updates
- Leaderboard management

### 3. Backend (app.py)
- Flask web server
- API endpoints
- Game state management
- Data persistence

## API Endpoints

1. `/api/start-game`
   - POST request
   - Starts a new game
   - Parameters: difficulty level

2. `/api/check-guess`
   - POST request
   - Validates a guess
   - Parameters: guess word

3. `/api/hint`
   - GET request
   - Provides a hint
   - Returns: hint text

4. `/api/leaderboard`
   - GET request
   - Returns leaderboard data
   - Parameters: difficulty level

5. `/api/score`
   - POST request
   - Saves player score
   - Parameters: score data

## Data Storage

### Word Lists
- Stored in JSON format
- Separate files for each difficulty level
- Regularly updated with new words

### User Data
- Stored in `data/users.json`
- Tracks user preferences
- Maintains game history

### Leaderboard
- Stored in `data/leaderboard.json`
- Tracks high scores
- Organized by difficulty level

## Development Guide

### Setting Up Development Environment

1. Clone the repository
2. Create a virtual environment
3. Install dependencies
4. Set up environment variables
5. Run the development server

### Making Changes

1. Follow the existing code structure
2. Update tests when modifying functionality
3. Document new features
4. Update requirements.txt if adding dependencies

### Testing

1. Test all difficulty levels
2. Verify leaderboard functionality
3. Check responsive design
4. Test dark/light theme
5. Verify data persistence

## Deployment

### Docker Deployment
1. Build the Docker image
2. Configure environment variables
3. Run the container
4. Access the application

### Manual Deployment
1. Set up Python environment
2. Install dependencies
3. Configure environment variables
4. Run the Flask application

## Common Issues and Solutions

1. **Word Validation Issues**
   - Check word list files
   - Verify API connectivity
   - Check error logs

2. **Leaderboard Not Updating**
   - Verify data directory permissions
   - Check JSON file format
   - Ensure proper API calls

3. **Theme Switching Problems**
   - Clear browser cache
   - Check CSS file loading
   - Verify JavaScript execution

## Best Practices

1. **Code Organization**
   - Follow the existing structure
   - Use meaningful variable names
   - Add comments for complex logic

2. **Error Handling**
   - Implement proper error messages
   - Log errors appropriately
   - Provide user-friendly feedback

3. **Performance**
   - Optimize database queries
   - Minimize API calls
   - Use efficient algorithms

4. **Security**
   - Validate user input
   - Sanitize data
   - Implement proper error handling

## Future Improvements

1. **Features**
   - Additional difficulty levels
   - More word categories
   - Enhanced hint system

2. **Technical**
   - Database migration
   - API optimization
   - Enhanced security

3. **UI/UX**
   - More animations
   - Additional themes
   - Improved mobile experience 