# Vinci — A Socratic AI Tutor for Learning Python

> An AI tutoring system that guides novice programmers through their own thinking — instead of just giving them the answer.

Built for **CS 6460: Educational Technology** at Georgia Tech.

---

## What is Vinci?

Vinci is a web-based Python tutoring platform grounded in the Socratic method. Students work through beginner-level coding challenges with AI guidance that adapts across three learning stages — from open-ended questioning, to live code feedback, to a fully annotated solution.

The core design principle: **struggle is where understanding happens**. Vinci is engineered to delay the answer for as long as pedagogically appropriate.

---

## Three-Stage Learning Flow

| Stage | Name | What happens |
|-------|------|-------------|
| 1 | Socratic | AI asks guiding questions about your approach — no hints, no answers |
| 2 | Code Review | Upload your attempt; AI runs unit tests and explains what failed |
| 3 | Solution | AI reveals a complete, fully commented reference solution |

Students advance between stages deliberately, tracking hints received, tests failed, and time per stage.

---

## Challenges

Six beginner Python problems, each targeting a core concept:

| Challenge | Concepts |
|-----------|----------|
| `count_vowels` | strings, loops, conditionals |
| `dedupe` | lists, sorting, iteration |
| `fizzbuzz` | loops, modulo, conditionals |
| `is_palindrome` | strings, slicing, comparison |
| `letter_grade` | conditionals, comparison ranges |
| `my_max` | lists, iteration, comparison |

Each challenge includes a pre-challenge knowledge check, a sample buggy attempt to start from, and a full pytest suite.

---

## Tech Stack

- **Backend:** Python, Flask
- **AI:** Ollama (local LLM via `gpt-oss:20b`)
- **Testing:** pytest — sandboxed execution per submission
- **Frontend:** Vanilla JavaScript, HTML/CSS, marked.js, highlight.js
- **Sessions:** Flask sessions + JSON-based server-side logging

---

## Running Locally

**Prerequisites:** Python 3.10+, [Ollama](https://ollama.com) running locally with `gpt-oss:20b` pulled.

```bash
git clone https://github.com/Amkangethe/vinci-socratic-tutor
cd vinci-socratic-tutor

python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Open `http://localhost:5555` in your browser.

To enable debug mode during development:
```bash
FLASK_DEBUG=true python app.py
```

---

## Project Structure

```
final-project/
├── app.py                  # Flask routes and test execution
├── ollama_ai.py            # LLM service wrapper
├── requirements.txt
├── templates/
│   ├── index.html          # Main app
│   └── login.html          # Login page
├── static/
│   ├── css/
│   │   ├── index.css
│   │   └── login.css
│   ├── scripts/
│   │   └── index.js        # Challenge logic, chat, stage flow
│   ├── img/
│   └── samples/            # Downloadable starter files per challenge
└── tests/                  # pytest suites for each challenge
```

---

## Author

**Allan Kangethe** — [allankangethe.com](https://www.allankangethe.com)

Georgia Tech · CS 6460 Educational Technology · Spring 2026
