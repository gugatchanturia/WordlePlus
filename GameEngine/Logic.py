from collections import Counter

from Database import *
import random

num = random.randint(0, len(IIILetterWords))

print(IIILetterWords.get(num))
def printArr(arr):
    for item in arr:
        print(item + "", end = "")
    print()

def playGame(n):
    if n == 3:
        myWord = IIILetterWords.get(random.randint(0, len(IIILetterWords)))
        print("Easy mode: ")
    if n == 5:
        myWord = VLetterWords.get(random.randint(0, len(VLetterWords)))
        print("Medium mode: ")
    #if n == 7:



    entries = 0
    matching = ['_'] * n
    printArr(matching)

    while True:

        userinput = input().upper()
        if (n == 3 and userinput in IIILetterWords.values()) or (n == 5 and userinput in VLetterWords.values()):
            matching = ['_'] * n
            remaining = Counter(myWord)
            for i in range(n):
                if userinput[i] == myWord[i]:
                    matching[i] = '*'
                    remaining[userinput[i]] -= 1

            for i in range(n):
                if matching[i] == '_' and userinput[i] in remaining and remaining[userinput[i]] > 0:
                    matching[i] = '^'
                    remaining[userinput[i]] -= 1


            printArr(matching)

            entries += 1

            if matching == ['*'] * n:
                print("Congratulations! You guessed the word " + myWord + " correctly in " + str(entries) + " tries!")
                break



        else:
            print("Not a word, please try again. Make sure your word is not exceeding the word length limit of " + str(n) + ".")
            continue



pass

userinput =0

while userinput != -1:
    print("Welcome to Wordle+, please select desired operation from the menu\n"
          "1.Play\n"
          "2.Exit")
    userinput = int(input())
    if userinput == 1:
        print("Please choose difficulty level to continue:\n"
              "1.Easy - 3 letter words\n"
              "2.Medium - 5 letter words\n"
              "3.Hard - 7 letter words\n"
              "4.Exit")
        userinput = int(input())
        if userinput == 1:
            playGame(3)
        elif userinput == 2:
            playGame(5)
        elif userinput == 3:
            playGame(7)
        elif userinput == 4:
            print("Bye, thanks for stopping by")
            break
        else:
            print("Wrong input, make sure your answer is in the list")
            continue


    if userinput == 2:
        print("Bye, thanks for stopping by")
        break




