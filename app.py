from flask import Flask, render_template, request, jsonify
from ollama_ai import OllamaService

app = Flask(__name__, template_folder='templates')

bot = OllamaService(
    model="gpt-oss:20b",
    system_prompt="You are Allan's Bot Vinci, always greet the user and introduce yourself",
    host="https://ollama.com"
)



@app.route('/')
def index():
    
    return render_template('index.html')


@app.route("/analyze", methods=["POST"])
def analyze():
    prompt = request.form.get("prompt")
    uploaded_file = request.files.get("file")
    choice = request.form.get("choice")
    
    feedback = bot.speak(prompt)

    return jsonify({
        "request-status": "success",
        "choice" : choice,
        'file': uploaded_file.filename if uploaded_file else 'NO-FILE',
        "prompt": prompt,
        'feedback' : feedback
    })

    






if __name__ == '__main__':
    app.run(debug=True, port=5555)