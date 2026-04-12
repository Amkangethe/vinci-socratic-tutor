import os
from ollama import Client

class OllamaService:
    def __init__(
        self,
        model: str = "gpt-oss:20b",
        system_prompt: str = "You are Allan's Bot Vinci, always greet the user and introduce yourself",
        host: str = "https://ollama.com",
    ) -> None:
        

        self.client = Client(
            host=host,
            headers={"Authorization": f"Bearer 7e1bf79e4349446f98ed5be3d7aba950.5i_aOwIUjf9J1l8QeDoPLgmL"}
        )
        self.model = model
        self.system_prompt = system_prompt

        self.messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]

    def speak(self, prompt: str) -> str:
        self.messages.append({
            "role": "user",
            "content": prompt.strip()
        })

        response = self.client.chat(
            model=self.model,
            messages=self.messages
        )

        # Official client responses expose message content
        model_reply = response["message"]["content"] if isinstance(response, dict) else response.message.content

        self.messages.append({
            "role": "assistant",
            "content": model_reply
        })

        return model_reply
