from flask import Flask, render_template, request, jsonify
from ollama_ai import OllamaService
import subprocess
import sys
import os
import tempfile

app = Flask(__name__, template_folder='templates')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

bot = OllamaService(
    model="gpt-oss:20b",
    host="https://ollama.com"
)

CHALLENGE_TESTS = {
    'count_vowels': 'tests/test_count_vowels.py',
    'dedupe':       'tests/test_dedupe.py',
    'fizzbuzz':     'tests/test_fizzbuzz.py',
    'is_palindrome':'tests/test_is_palindrome.py',
    'letter_grade': 'tests/test_letter_grade.py',
    'my_max':       'tests/test_my_max.py',
}

CHALLENGE_ATTEMPT_FILES = {
    'count_vowels': 'student_attempts/count_vowels_attempt.py',
    'dedupe':       'student_attempts/dedupe_attempt.py',
    'fizzbuzz':     'student_attempts/fizzbuzz_attempt.py',
    'is_palindrome':'student_attempts/is_palindrome_attempt.py',
    'letter_grade': 'student_attempts/letter_grade_attempt.py',
    'my_max':       'student_attempts/my_max_attempt.py',
}


def run_tests(challenge, file_content):
    if challenge not in CHALLENGE_TESTS:
        return None

    test_path = os.path.join(BASE_DIR, CHALLENGE_TESTS[challenge])

    # Write to a temp directory so Flask's reloader doesn't restart mid-request
    with tempfile.TemporaryDirectory() as tmpdir:
        attempts_dir = os.path.join(tmpdir, 'student_attempts')
        os.makedirs(attempts_dir)

        open(os.path.join(attempts_dir, '__init__.py'), 'w').close()

        attempt_file = CHALLENGE_ATTEMPT_FILES[challenge].split('/')[-1]
        with open(os.path.join(attempts_dir, attempt_file), 'w') as f:
            f.write(file_content)

        env = os.environ.copy()
        env['PYTHONPATH'] = tmpdir

        try:
            result = subprocess.run(
                [sys.executable, '-m', 'pytest', test_path, '-v', '--tb=short', '--no-header'],
                capture_output=True, text=True, timeout=10,
                cwd=tmpdir, env=env
            )
            return result.stdout + (result.stderr or '')
        except subprocess.TimeoutExpired:
            return "Tests timed out after 10 seconds."
        except Exception as e:
            return f"Error running tests: {str(e)}"


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/reset", methods=["POST"])
def reset():
    bot.reset()
    return jsonify({"status": "reset"})


@app.route("/analyze", methods=["POST"])
def analyze():
    prompt        = request.form.get("prompt", "")
    uploaded_file = request.files.get("file")
    choice        = request.form.get("choice")
    stage         = int(request.form.get("stage", 1))

    file_content = None
    if uploaded_file:
        file_content = uploaded_file.read().decode("utf-8", errors="replace")

    test_results = None
    if stage == 2 and file_content and choice:
        test_results = run_tests(choice, file_content)

    try:
        feedback = bot.speak(prompt, file_content=file_content, challenge=choice, stage=stage, test_results=test_results)
    except Exception as e:
        feedback = f"Something went wrong reaching the model: {str(e)}"

    return jsonify({
        "request-status": "success",
        "choice": choice,
        "file": uploaded_file.filename if uploaded_file else 'NO-FILE',
        "prompt": prompt,
        "feedback": feedback
    })


if __name__ == '__main__':
    app.run(debug=True, port=5555)
