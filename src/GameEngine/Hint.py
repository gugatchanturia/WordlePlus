from dotenv import load_dotenv
import os
from openai import OpenAI
import inspect


load_dotenv()
api_key = os.getenv("API_KEY")
def Hint(my_word):
    print("Creating OpenAI client in HINT")

    client = OpenAI(
        api_key=api_key
    )

    print("Created OpenAI client successfully in HINT")

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"Write a basic explanation of a given word, "
                                        f"basically a hint for a wordle game in maximum one sentence, "
                                        f"hint should not be too clear, so that it's a little bit challenging for user to guess the word. "
                                        f"The word: {my_word}"}
        ]
    )
    return completion.choices[0].message.content

#FOR TESTING
#Hint("fog")