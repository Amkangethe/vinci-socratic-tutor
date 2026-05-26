from flask import Flask, render_template, request, jsonify, send_from_directory, session, redirect, url_for
from ollama_ai import OllamaService
import subprocess
import sys
import os
import tempfile
import json
from datetime import datetime

app = Flask(__name__, template_folder='templates')
app.secret_key = 'vinci-cs6460-secret-key'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SESSIONS_LOG = os.path.join(BASE_DIR, 'sessions_log.json')

bot = OllamaService(model="gpt-oss:20b")

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


def load_sessions():
    if not os.path.exists(SESSIONS_LOG):
        return []
    with open(SESSIONS_LOG, 'r') as f:
        return json.load(f)


def save_session_entry(entry):
    sessions = load_sessions()
    sessions.append(entry)
    with open(SESSIONS_LOG, 'w') as f:
        json.dump(sessions, f, indent=2)


@app.route('/', methods=['GET'])
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session['username'])


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        if name:
            session['username'] = name
            return redirect(url_for('index'))
    return render_template('login.html')


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/sample/<challenge>')
def sample(challenge):
    return send_from_directory(
        os.path.join(BASE_DIR, 'static', 'samples'),
        f'{challenge}_attempt.py',
        as_attachment=True
    )


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


@app.route("/log_session", methods=["POST"])
def log_session():
    data = request.get_json()
    entry = {
        "username": session.get('username', 'anonymous'),
        "challenge": data.get("challenge"),
        "pre_check_answer": data.get("pre_check_answer"),
        "hints_received": data.get("hints_received"),
        "tests_failed": data.get("tests_failed"),
        "time_stage1_seconds": data.get("time_stage1_seconds"),
        "time_stage2_seconds": data.get("time_stage2_seconds"),
        "time_stage3_seconds": data.get("time_stage3_seconds"),
        "completed_at": datetime.utcnow().isoformat()
    }
    save_session_entry(entry)
    return jsonify({"status": "logged"})


if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug, port=5555)
