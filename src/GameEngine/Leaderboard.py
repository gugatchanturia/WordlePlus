import json
import os
from datetime import datetime

class Leaderboard:
    def __init__(self):
        self.db_file = 'GameEngine/leaderboard.json'
        self.ensure_db_exists()
        self.load_data()

    def ensure_db_exists(self):
        if not os.path.exists(self.db_file):
            initial_data = {
                'users': {},  # Store user names by device ID
                'scores': {
                    '3': [],  # 3-letter word scores
                    '5': [],  # 5-letter word scores
                    '7': []   # 7-letter word scores
                }
            }
            with open(self.db_file, 'w') as f:
                json.dump(initial_data, f, indent=4)

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

    def add_score(self, device_id, difficulty, time_seconds):
        user_name = self.get_user_name(device_id)
        if not user_name:
            return False

        # Remove previous score for this user and difficulty if exists
        self.data['scores'][str(difficulty)] = [
            score for score in self.data['scores'][str(difficulty)]
            if score['device_id'] != device_id
        ]

        # Add new score
        new_score = {
            'device_id': device_id,
            'name': user_name,
            'time': time_seconds,
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        self.data['scores'][str(difficulty)].append(new_score)

        # Sort scores by time
        self.data['scores'][str(difficulty)].sort(key=lambda x: x['time'])

        # Keep only top 10 scores
        self.data['scores'][str(difficulty)] = self.data['scores'][str(difficulty)][:10]
        
        self.save_data()
        return True

    def get_leaderboard(self, difficulty):
        return self.data['scores'][str(difficulty)]

    def format_time(self, seconds):
        minutes = int(seconds // 60)
        remaining_seconds = int(seconds % 60)
        if minutes > 0:
            return f"{minutes}m {remaining_seconds}s"
        return f"{remaining_seconds}s" 