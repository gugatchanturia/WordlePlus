import json
import os
from datetime import datetime

class Leaderboard:
    def __init__(self):
        self.db_file = 'src/GameEngine/leaderboard.json'
        self.ensure_db_exists()
        self.load_data()

    def ensure_db_exists(self):
        """Ensure the leaderboard database file exists"""
        if not os.path.exists(self.db_file):
            # Create the directory if it doesn't exist
            os.makedirs(os.path.dirname(self.db_file), exist_ok=True)
            # Create an empty leaderboard
            with open(self.db_file, 'w') as f:
                json.dump({
                    'easy': [],
                    'medium': [],
                    'hard': []
                }, f, indent=4)

    def load_data(self):
        with open(self.db_file, 'r') as f:
            self.data = json.load(f)

    def save_data(self):
        with open(self.db_file, 'w') as f:
            json.dump(self.data, f, indent=4)

    def get_user_name(self, device_id):
        return self.data['users'].get(device_id)

    def set_user_name(self, device_id, name):
        self.data['users'][device_id] = name
        self.save_data()

    def add_score(self, difficulty, player_name, score, word):
        """Add a new score to the leaderboard"""
        try:
            with open(self.db_file, 'r') as f:
                leaderboard = json.load(f)
        except FileNotFoundError:
            leaderboard = {
                'easy': [],
                'medium': [],
                'hard': []
            }

        # Add new score
        leaderboard[difficulty].append({
            'player': player_name,
            'score': score,
            'word': word,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

        # Sort by score (ascending)
        leaderboard[difficulty].sort(key=lambda x: x['score'])

        # Keep only top 10 scores
        leaderboard[difficulty] = leaderboard[difficulty][:10]

        # Save updated leaderboard
        with open(self.db_file, 'w') as f:
            json.dump(leaderboard, f, indent=4)

    def get_leaderboard(self, difficulty):
        """Get the leaderboard for a specific difficulty"""
        try:
            with open(self.db_file, 'r') as f:
                leaderboard = json.load(f)
                return leaderboard.get(difficulty, [])
        except FileNotFoundError:
            return []

    def format_time(self, seconds):
        minutes = int(seconds // 60)
        remaining_seconds = int(seconds % 60)
        if minutes > 0:
            return f"{minutes}m {remaining_seconds}s"
        return f"{remaining_seconds}s" 