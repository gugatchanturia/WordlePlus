from dotenv import load_dotenv
import os
from openai import OpenAI
from GameEngine.Database import load_words, addToDictionary

load_dotenv()
api_key = os.getenv("API_KEY")

# Load existing words from JSON at startup
load_words()

def isValidWord(usersWord, n):

    usersWord = usersWord.lower()

    if len(usersWord) != n:
        return False

    elif (n == 3 and usersWord in load_words().three_letter_words) or (n == 5 and usersWord in load_words().five_letter_words) or (n == 7 and usersWord in load_words().seven_letter_words):
        return True

    else:
        print("word was not found in the existing dictionaries, asking ChatGPT if the word exists")

        client = OpenAI(api_key=api_key)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Check if the given word exists. "
                        f"Only respond with True or False — nothing more. "
                        f"The word should be officially recognized in real English dictionaries. "
                        f"The word: {usersWord}"
                    )
                }
            ]
        )

        isValid = completion.choices[0].message.content.strip()

        if isValid == "True":
            print("ChatGPT said that your word is valid, thanks for improving the game!")
            if n == 3:
                addToDictionary(usersWord, "three_letter_words.json")
                load_words()
            elif n == 5:
                addToDictionary(usersWord, "five_letter_words.json")
                load_words()
            elif n == 7:
                addToDictionary(usersWord, "seven_letter_words.json")
                load_words()
            return True

    return False
