from collections import Counter
from Database import *
import random
import time

def printArr(arr):
    for item in arr:
        print(item + "", end = "")
    print()

def playGame():
    n = 0
    my_word = "Null"
    while True:
        print("Please choose difficulty level to continue:\n"
              "1.|█____| Easy: 3-letter words\n"
              "2.|███__| Medium: 5-letter words\n"
              "3.|█████| Hard: 7-letter words\n"
              "4.Cancel")
        gameChoice = int(input())
        if gameChoice == 1:
            n = 3
            break
        elif gameChoice == 2:
            n = 5
            break
        elif gameChoice == 3:
            n = 7
            break
        elif gameChoice == 4:
            return
        else:
            print("Wrong input, make sure your answer is in the list")
            continue

    if n == 3:
        my_word = three_letter_words.get(random.randint(0, len(three_letter_words)))
        print("Easy mode: ")
    if n == 5:
        my_word = five_letter_words.get(random.randint(0, len(five_letter_words)))
        print("Medium mode: ")
    if n == 7:
        my_word = seven_letter_words.get(random.randint(0, len(seven_letter_words)))
        print("Hard mode: ")



    entries = 0
    start = time.time()

    while True:

        userinput = input().upper()
        if (n == 3 and userinput in three_letter_words.values()) or (n == 5 and userinput in five_letter_words.values()) or (n == 7 and userinput in seven_letter_words.values()):

            matching = ['‾'] * n
            remaining = Counter(my_word)
            for i in range(n):
                if userinput[i] == my_word[i]:
                    matching[i] = '*'
                    remaining[userinput[i]] -= 1

            for i in range(n):
                if matching[i] == '‾' and userinput[i] in remaining and remaining[userinput[i]] > 0:
                    matching[i] = '^'
                    remaining[userinput[i]] -= 1

            printArr(matching)
            entries += 1

            if matching == ['*'] * n:
                end = time.time()
                print(f"Congratulations! You guessed the word {my_word} correctly in {int((end - start) // 60)} minutes and {((end - start) % 60):.2f} seconds, and in {entries} tries!")
                break

        elif userinput == "IGIVEUP":
            print("The word was " + my_word + "! Better luck next time though!")
            break
        else:
            print("Not a word, please try again. Make sure your word is not exceeding the word length limit of " + str(n) + ".")
            continue

pass

entries = 0
while True:
    if entries > 0:
        print("Would you like to continue?\n"
              "1. Continue\n"
              "2. Exit")
    else:
        print("Welcome to Wordle+, please select desired operation from the menu\n"
            "1.Play\n"
            "2.Exit")

    try:
        userinput = int(input())
        if userinput == 1:
            entries += 1
            playGame()
            continue
        if userinput == 2:
            print("Bye, thanks for stopping by")
            break
        else:
            print("Wrong input, make sure your answer is in the list, main branch")
            continue

    except ValueError:
        print("Invalid input! Please enter an integer.")







