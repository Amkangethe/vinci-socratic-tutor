from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    
    return render_template('index.html')


@app.route("/analyze", methods=["POST"])
def analyze():
    prompt = request.form.get("prompt")
    uploaded_file = request.files.get("file")

    filename = uploaded_file.filename if uploaded_file else None

    return jsonify({
        "status": "success",
        "prompt": prompt,
        "filename": filename
    })


if __name__ == '__main__':
    app.run(debug=True, port=5555)