import json
import os

# File paths
THREE_PATH = os.path.join(os.path.dirname(__file__), "three_letter_words.json")
FIVE_PATH = os.path.join(os.path.dirname(__file__), "five_letter_words.json")
SEVEN_PATH = os.path.join(os.path.dirname(__file__), "seven_letter_words.json")

three_letter_words = {}
five_letter_words = {}
seven_letter_words = {}

def load_words():
    global three_letter_words, five_letter_words, seven_letter_words
    with open(THREE_PATH) as f3:
        three_letter_words = json.load(f3)
    with open(FIVE_PATH) as f5:
        five_letter_words = json.load(f5)
    with open(SEVEN_PATH) as f7:
        seven_letter_words = json.load(f7)
    
    # Return a class-like object with the dictionaries as attributes
    class Words:
        def __init__(self):
            self.three_letter_words = three_letter_words
            self.five_letter_words = five_letter_words
            self.seven_letter_words = seven_letter_words
    
    return Words()

def addToDictionary(word, file_path):
    print("Adding the word to the database... ", end = "")
    word = word.lower()

    # Use the correct file path based on the file name
    if file_path == "three_letter_words.json":
        actual_path = THREE_PATH
    elif file_path == "five_letter_words.json":
        actual_path = FIVE_PATH
    elif file_path == "seven_letter_words.json":
        actual_path = SEVEN_PATH
    else:
        print("Error: Invalid file path")
        return

    if os.path.exists(actual_path):
        with open(actual_path, "r") as f:
            data = json.load(f)
    else:
        data = {}

    data[word] = 1

    # Save everything back
    with open(actual_path, "w") as f:
        json.dump(data, f, indent=4)

    print("Done!")

