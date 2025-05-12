# WordlePlus

A modern take on the classic word-guessing game with multiple difficulty levels and a leaderboard system.

## Features

- Multiple difficulty levels (3, 5, and 7 letter words)
- Real-time feedback on guesses
- Hint system powered by OpenAI's GPT
- Leaderboard tracking
- Dark/Light theme support
- Responsive design

## Prerequisites

- Docker and Docker Compose
- OpenAI API Key (for hint generation and word validation)

### Getting an OpenAI API Key

1. Go to [OpenAI's Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy your API key (you'll need it for the next step)

## Running with Docker

### Environment Setup

Before building the Docker image, you need to set up your environment variables:

1. Create a `.env` file in the project root:
```bash
# On Linux/macOS
touch .env

# On Windows (PowerShell)
New-Item -Path . -Name ".env" -ItemType "File"

```

2. Add the following variables to your `.env` file:
```env
OPENAI_API_KEY=your_api_key_here  # Required for hints and word validation

```

> ⚠️ **Important**: The game requires a valid OpenAI API key to function properly. Without it, the hint system and word validation features will not work.

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/gugatchanturia/WordlePlus.git
cd WordlePlus
```

2. Set up your environment variables as described above

3. Build and run with Docker Compose:
```bash
docker-compose up --build
```

4. Access the game at `http://localhost:5000`

### Manual Docker Build

If you prefer to build and run without Docker Compose:

1. Build the Docker image:
```bash
docker build -t wordleplus .
```

2. Run the container:
```bash
docker run -p 5000:5000 -v $(pwd)/src/GameEngine:/app/src/GameEngine wordleplus
```

## Development

### Local Development Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env
# Edit .env with your OpenAI API key and other configuration
```

4. Run the development server:
```bash
python src/app.py
```

## Data Persistence

The game's data (leaderboard and user information) is stored in the `src/GameEngine` directory. This directory is mounted as a volume in Docker to ensure data persistence between container restarts.
![WordlePlus Screenshot 1](screenshots/Screenshot%202025-05-10%20150115.png)
![WordlePlus Screenshot 2](screenshots/Screenshot%202025-05-10%20150133.png)
![WordlePlus Screenshot 3](screenshots/Screenshot%202025-05-10%20150240.png)
![WordlePlus Screenshot 4](screenshots/Screenshot%202025-05-10%20150255.png)


