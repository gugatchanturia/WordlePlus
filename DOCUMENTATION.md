# WordlePlus Documentation

## Overview
WordlePlus is a web-based word guessing game that uses ChatGPT for word validation and hint generation. The game features a modern interface with dark mode support, keyboard input, and a hint system.

## Architecture Overview

### Frontend Architecture
The frontend is built using vanilla JavaScript, HTML, and CSS, following a modern component-based approach:

1. **HTML Structure**
   - `index.html`: Contains the main game interface divided into sections:
     - Welcome screen
     - Difficulty selection
     
### Frontend Error Handling
1. **Input Validation**
   - Word length checks
   - Invalid word patterns
   - Empty input handling

2. **API Error Handling**
   - Network errors
   - Invalid responses
   - Server errors

3. **UI Feedback**
   - Toast notifications
   - Visual indicators
   - Error messages

### Backend Error Handling
1. **Input Validation**
   - Word format checks
   - Game state validation
   - API key validation

2. **ChatGPT Integration**
   - API error handling
   - Response parsing
   - Timeout handling

## Performance Considerations

### Frontend Optimization
1. **DOM Manipulation**
   - Batch updates
   - Virtual DOM-like updates
   - Efficient event delegation

2. **State Management**
   - Minimal state updates
   - Efficient state propagation
   - Memory management

3. **Asset Loading**
   - Lazy loading
   - Asset optimization
   - Caching strategies

### Backend Optimization
1. **API Calls**
   - Request batching
   - Response caching
   - Connection pooling

2. **ChatGPT Integration**
   - Response caching
   - Request optimization
   - Error recovery

## Security Considerations

### Frontend Security
1. **Input Sanitization**
   - XSS prevention
   - Input validation
   - Output encoding

2. **Data Protection**
   - Secure storage
   - Token management
   - Session handling

### Backend Security
1. **API Security**
   - Rate limiting
   - Authentication
   - Authorization

2. **Data Protection**
   - Input validation
   - Output sanitization
   - Secure storage

## Testing and Debugging

### Frontend Testing
1. **Unit Testing**
   - Function testing
   - Event handling
   - State management

2. **UI Testing**
   - Layout testing
   - Responsive testing
   - Theme testing

### Backend Testing
1. **API Testing**
   - Endpoint testing
   - Response validation
   - Error handling

2. **Integration Testing**
   - ChatGPT integration
   - Database integration
   - Frontend integration

## File Structure
- `templates/index.html`: Main HTML file containing the game interface
- `static/css/style.css`: Styles for the game interface
- `static/js/game.js`: Game logic and functionality
- `app.py`: Flask backend server

## Game State
The game maintains its state through the `gameState` object:
```javascript
{
    word: "",           // Current word to guess
    difficulty: "",     // Game difficulty level
    maxAttempts: 0,     // Maximum number of attempts allowed
    attempts: 0,        // Current number of attempts
    currentGuess: "",   // Current guess being typed
    currentRow: 0,      // Current row in the grid
    hintUsed: false,    // Whether a hint has been used
    currentHint: "",    // Current hint text
    isLoading: false    // Whether the game is in a loading state
}
```

## Key Functions

### Game Initialization
- `initGame()`: Sets up event listeners and initializes the game state
- `startGame(difficulty)`: Starts a new game with the specified difficulty
- `createCurrentGuessGrid()`: Creates the grid for displaying the current guess

### Input Handling
- `handleKeyPress(event)`: Handles keyboard input for letter entry
- `handleKeyClick(event)`: Handles virtual keyboard clicks
- `disableInput()`: Disables input during loading states
- `enableInput()`: Re-enables input after loading states

### Game Logic
- `submitGuess()`: Submits the current guess for validation
- `getHint()`: Requests a hint from ChatGPT
- `giveUp()`: Ends the current game and reveals the word
- `checkWin(guess)`: Checks if the guess matches the target word
- `updateKeyboard(guess, feedback)`: Updates the keyboard colors based on feedback

### UI Updates
- `updateCurrentGuessGrid()`: Updates the current guess grid display
- `showToast(message, type)`: Displays a toast notification
- `toggleTheme()`: Switches between light and dark themes

## CSS Variables
The game uses CSS variables for theming and consistent styling:

### Light Theme
```css
--primary-color: #007bff;
--secondary-color: #6c757d;
--success-color: #28a745;
--warning-color: #ffc107;
--danger-color: #dc3545;
--light-color: #f8f9fa;
--dark-color: #343a40;
--bg-color: #f8f9fa;
--text-color: #212529;
--section-bg: #ffffff;
--grid-border: #dee2e6;
--grid-active: #e9ecef;
```

### Dark Theme
```css
--primary-color: #0d6efd;
--secondary-color: #6c757d;
--success-color: #198754;
--warning-color: #ffc107;
--danger-color: #dc3545;
--light-color: #f8f9fa;
--dark-color: #212529;
--bg-color: #121212;
--text-color: #f8f9fa;
--section-bg: #1e1e1e;
--grid-border: #343a40;
--grid-active: #2d2d2d;
```

## API Integration
The game communicates with ChatGPT through the Flask backend:
- Word validation
- Hint generation
- Word selection

## Responsive Design
The game interface adapts to different screen sizes:
- Mobile-friendly keyboard layout
- Responsive grid sizing
- Adaptive font sizes

## Local Storage
The game saves user preferences:
- Theme preference (light/dark mode)
- Game statistics (if implemented) 