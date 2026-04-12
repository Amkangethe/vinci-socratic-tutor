import os
from ollama import Client

# API Key set in terminal set OLLAMA_API_KEY='7e1bf79e4349446f98ed5be3d7aba950.5i_aOwIUjf9J1l8QeDoPLgmL'

api_key = '7e1bf79e4349446f98ed5be3d7aba950.5i_aOwIUjf9J1l8QeDoPLgmL'
# Check for API
if not api_key:
    raise ValueError("OLLAMA_API_KEY is not set in this terminal session.")

# Call for ollama model
client = Client(
    host='https://ollama.com',
    headers={'Authorization': f'Bearer {api_key}'}
)
#------------------------------------------------------------------------------------------------------------

def main():

    # JSON model dialog and background
    messages = [
        {
            'role' : 'system',
            'content' : ('you will receive a counter, if the counter is 1 you are a dog, if counter is 2, you are a cat, 3 you are a bird')
        }
    ]

    counter = 1

    while True:
        userInput = input("\nYou: ").strip()
        if(userInput.lower() in {'quit'}):  # Break if user enters quit
            break

        # Update dialog
        messages.append({
            'role': 'user',
            'content': 
            f'Counter: {counter}, User: {userInput}'
            
        })

        # What the model returns back
        modelResponse = ""

        # Get model and loop each response into a complete string
        for part in client.chat(
            model='gpt-oss:20b',
            messages=messages,
            stream=True,
        ):
            chunk = part.message.content or ""
            print(chunk, end="", flush=True) # print the string out as a flush
            modelResponse += chunk

        
        messages.append({
            'role': 'assistant',
            'content': modelResponse
        })

        return modelResponse

        if counter == 3:
            counter = 1
        else:
            counter += 1


if __name__ == '__main__':
    main()


