import json
import os
from datetime import datetime

class Leaderboard:
    def __init__(self):
        self.db_file = 'src/GameEngine/leaderboard.json'
        self.data = {
            'users': {},
            'scores': {
                '3': [],
                '5': [],
                '7': []
            }
        }
        self.ensure_db_exists()
        self.load_data()

    def ensure_db_exists(self):
        """Ensure the leaderboard database file exists"""
        if not os.path.exists(self.db_file):
            # Create the directory if it doesn't exist
            os.makedirs(os.path.dirname(self.db_file), exist_ok=True)
            # Create an empty leaderboard
            with open(self.db_file, 'w') as f:
                json.dump(self.data, f, indent=4)

    def load_data(self):
        """Load the leaderboard data"""
        try:
            with open(self.db_file, 'r') as f:
                loaded_data = json.load(f)
                # Ensure all required keys exist
                if 'users' not in loaded_data:
                    loaded_data['users'] = {}
                if 'scores' not in loaded_data:
                    loaded_data['scores'] = {'3': [], '5': [], '7': []}
                else:
                    # Ensure all difficulty levels exist
                    for diff in ['3', '5', '7']:
                        if diff not in loaded_data['scores']:
                            loaded_data['scores'][diff] = []
                self.data = loaded_data
        except (FileNotFoundError, json.JSONDecodeError):
            # If file doesn't exist or is invalid, use default data
            self.save_data()

    def save_data(self):
        """Save the leaderboard data"""
        with open(self.db_file, 'w') as f:
            json.dump(self.data, f, indent=4)

    def get_user_name(self, device_id):
        """Get the user name for a device ID"""
        return self.data['users'].get(device_id)

    def set_user_name(self, device_id, name):
        """Set the user name for a device ID"""
        self.data['users'][device_id] = name
        self.save_data()

    def add_score(self, device_id, difficulty, time_seconds):
        """Add a new score to the leaderboard"""
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
        """Get the leaderboard for a specific difficulty"""
        return self.data['scores'][str(difficulty)]

    def format_time(self, seconds):
        """Format time in seconds to a readable string"""
        minutes = int(seconds // 60)
        remaining_seconds = int(seconds % 60)
        if minutes > 0:
            return f"{minutes}m {remaining_seconds}s"
        return f"{remaining_seconds}s" 