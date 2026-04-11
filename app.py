from flask import Flask, render_template, request, jsonify
import test_ollama

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    
    return render_template('index.html')


@app.route("/analyze", methods=["POST"])
def analyze():
    prompt = request.form.get("prompt")
    uploaded_file = request.files.get("file")

    file = test_ollama.main()
    

    return jsonify({
        "status": "success",
        "prompt": prompt,
        'this' : file
    })


if __name__ == '__main__':
    app.run(debug=True, port=5555)