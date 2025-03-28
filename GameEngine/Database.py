import json
import os

# File paths
THREE_PATH = "three_letter_words.json"
FIVE_PATH = "five_letter_words.json"
SEVEN_PATH = "seven_letter_words.json"

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

def addToDictionary(word, file_path):
    print("Adding the word to the database... ", end = "")
    word = word.lower()

    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            data = json.load(f)
    else:
        data = {}

    data[word] = 1

    # Save everything back
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

    print("Done!")

