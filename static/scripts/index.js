//------------------------------------------------------------------------------------------------------------------------------------------------
// Challenges
const tasks = {
    count_vowels: {
        concepts: ["strings", "loops", "conditionals"],
        description: "Count how many vowels appear in a given string.",
        pre_check: "In your own words, what do you think a loop does in Python?"
    },
    dedupe: {
        concepts: ["lists", "sorting", "iteration"],
        description: "Remove repeated values from a list and keep only unique items.",
        pre_check: "How would you explain what a list is to someone who has never coded?"
    },
    fizzbuzz: {
        concepts: ["loops", "modulo", "conditionals"],
        description: "Return Fizz, Buzz, or FizzBuzz based on divisibility rules.",
        pre_check: "What do you think the % (modulo) operator does in Python?"
    },
    is_palindrome: {
        concepts: ["strings", "slicing", "comparison"],
        description: "Check whether a word or phrase reads the same backward.",
        pre_check: "How would you reverse a string in Python? Just describe it in plain English."
    },
    letter_grade: {
        concepts: ["conditionals", "comparison ranges", "returning values"],
        description: "Convert a numeric score into its matching letter grade.",
        pre_check: "What is an if/else statement and when would you use one?"
    },
    my_max: {
        concepts: ["lists", "iteration", "comparison"],
        description: "Find and return the largest value in a list.",
        pre_check: "If you had a list of numbers, how would you find the largest one without using any built-in functions?"
    }
};

//------------------------------------------------------------------------------------------------------------------------------------------------
// Toast notifications
function showToast(message, type = 'error') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// Completion tracker (localStorage)
function getCompleted() {
    return JSON.parse(localStorage.getItem('vinci_completed') || '[]');
}

function markCompleted(key) {
    const completed = getCompleted();
    if (!completed.includes(key)) {
        completed.push(key);
        localStorage.setItem('vinci_completed', JSON.stringify(completed));
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// Build challenge cards
const challenges_container = document.getElementById('challenge-container');

let challengeChosen = '';
let chatHistory = [];

function buildCards() {
    const completed = getCompleted();
    let html = '';
    Object.keys(tasks).forEach(key => {
        const isDone = completed.includes(key);
        const conceptTags = tasks[key].concepts.map(c => `<span class="concept-tag">${c}</span>`).join('');
        html += `
        <div class="challenge-card ${isDone ? 'challenge-done' : ''}" data-name="${key}">
            <div class="card-top">
                <img class="challenge-img" src="../static/img/python.png">
                <div>
                    <p class="challenge-name">${key} ${isDone ? '<span class="done-badge">✓ Done</span>' : ''}</p>
                    <p>${tasks[key].description}</p>
                    <div class="concept-tags">${conceptTags}</div>
                </div>
            </div>
            <div class="card-actions">
                <a class="sample-download-btn" href="/sample/${key}" download>⬇ Sample attempt</a>
                <button class="challenge-button" data-name="${key}">
                    <img class="right-arrow-icon" src="../static/img/right-arrow.png">
                </button>
            </div>
        </div>`;
    });
    challenges_container.innerHTML = html;
    attachChallengeListeners();
}

buildCards();

//------------------------------------------------------------------------------------------------------------------------------------------------
// UI elements
const promptBarContainer = document.getElementById('prompt-bar-container');
const challenges = document.getElementById('challenges');
const tempChatContainer = document.getElementById('chat-container');
const chatHeader = document.getElementById('chat-header');
const nextStageBtn = document.getElementById('next-stage-btn');
const backBtn = document.getElementById('back-btn');
const chatChallengeName = document.getElementById('chat-challenge-name');
const sessionSummary = document.getElementById('session-summary');
const summaryStats = document.getElementById('summary-stats');
const summaryBackBtn = document.getElementById('summary-back-btn');
const summaryCloseBtn = document.getElementById('summary-close-btn');
const preCheckModal = document.getElementById('pre-check-modal');
const preCheckQuestion = document.getElementById('pre-check-question');
const preCheckAnswer = document.getElementById('pre-check-answer');
const preCheckSubmit = document.getElementById('pre-check-submit');

promptBarContainer.style.display = 'none';
tempChatContainer.style.display = 'none';
chatHeader.style.display = 'none';

let currentStage = 1;
let sessionHints = 0;
let sessionFailedTests = 0;
let preCheckAnswerText = '';

// Stage timestamps
let stageStartTime = null;
let stageTimes = { 1: 0, 2: 0, 3: 0 };

//------------------------------------------------------------------------------------------------------------------------------------------------
// Back button
function showChallenges() {
    promptBarContainer.style.display = 'none';
    tempChatContainer.style.display = 'none';
    chatHeader.style.display = 'none';
    sessionSummary.style.display = 'none';
    challenges.style.display = '';
    buildCards();
}

backBtn.addEventListener('click', showChallenges);
summaryBackBtn.addEventListener('click', showChallenges);
summaryCloseBtn.addEventListener('click', () => { sessionSummary.style.display = 'none'; });

//------------------------------------------------------------------------------------------------------------------------------------------------
// Stage UI
function updateStageUI() {
    [1, 2, 3].forEach(n => {
        const pill = document.getElementById(`stage-pill-${n}`);
        pill.classList.toggle('active', n === currentStage);
        pill.classList.toggle('completed', n < currentStage);
    });

    if (currentStage === 2) nextStageBtn.textContent = 'Get Solution →';
    nextStageBtn.style.display = currentStage === 3 ? 'none' : '';
}

nextStageBtn.addEventListener('click', () => {
    // Record time for current stage before advancing
    if (stageStartTime) {
        stageTimes[currentStage] += Math.round((Date.now() - stageStartTime) / 1000);
    }
    currentStage++;
    stageStartTime = Date.now();
    updateStageUI();

    if (currentStage === 3) {
        sendMessage("Give me the complete solution.");
    }
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// Pre-check modal
function showPreCheck(key) {
    preCheckQuestion.textContent = tasks[key].pre_check;
    preCheckAnswer.value = '';
    preCheckModal.style.display = 'flex';
    preCheckAnswer.focus();
}

preCheckSubmit.addEventListener('click', () => {
    preCheckAnswerText = preCheckAnswer.value.trim();
    preCheckModal.style.display = 'none';
    startChallenge();
});

preCheckAnswer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        preCheckSubmit.click();
    }
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// Challenge selection
let pendingChallenge = '';

function startChallenge() {
    promptBarContainer.style.display = '';
    tempChatContainer.style.display = '';
    chatHeader.style.display = '';
    sessionSummary.style.display = 'none';
    challenges.style.display = 'none';

    currentStage = 1;
    updateStageUI();
    hasUploadedAttempt = false;
    sessionHints = 0;
    sessionFailedTests = 0;
    stageTimes = { 1: 0, 2: 0, 3: 0 };
    stageStartTime = Date.now();

    document.getElementById('chat-container').innerHTML = '';

    challengeChosen = pendingChallenge;
    chatChallengeName.textContent = challengeChosen.replace(/_/g, ' ');

    fetch("/reset", { method: "POST" });
}

function attachChallengeListeners() {
    document.querySelectorAll('.challenge-button').forEach((button) => {
        button.addEventListener('click', function(event) {
            pendingChallenge = event.currentTarget.dataset.name;
            showPreCheck(pendingChallenge);
        });
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// Textarea
const promptBar = document.getElementById("promptTextArea");

promptBar.addEventListener("input", function () {
    promptBar.style.height = "auto";
    promptBar.style.height = promptBar.scrollHeight + "px";
    updateSendButton();
});

promptBar.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// File upload
const fileInput = document.getElementById("fileInput");
const addedFile = document.getElementById('promptAddedFile');
addedFile.style.display = 'none';

fileInput.addEventListener('change', (event) => {
    const file = event.target.files;
    if (!file.length) return;
    if (file[0].size > 100 * 1024) {
        showToast('File too large. Please keep it under 100 KB.');
        fileInput.value = '';
        return;
    }
    addedFile.style.display = '';
    addedFile.innerHTML = `
        <img class="added-file-icon" src="../static/img/code.png">
        <div style="padding-left: 10px;">
            <p class="file-name-text">${file[0].name}</p>
            <p class="document-text">Python File</p>
        </div>`;
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// Send button
const sendBtn = document.getElementById('sendButton');

let hasUploadedAttempt = false;
let isAiTyping = false;

function updateSendButton() {
    const hasText = promptBar.value.trim().length > 0;
    sendBtn.style.display = (hasText && !isAiTyping) ? '' : 'none';
}

updateSendButton();

sendBtn.addEventListener('click', () => {
    const userPrompt = promptBar.value;
    if (!userPrompt.trim()) return;

    if (fileInput.files.length > 0) hasUploadedAttempt = true;

    if (!hasUploadedAttempt) {
        showToast('Please upload a Python file to begin.');
        return;
    }

    sendMessage(userPrompt);
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// Send message
async function sendMessage(userPrompt) {
    const chatContainer = document.getElementById('chat-container');

    const formData = new FormData();
    formData.append("prompt", userPrompt);
    formData.append("choice", challengeChosen);
    formData.append("stage", currentStage);

    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
        hasUploadedAttempt = true;
    }

    const attachedFileName = fileInput.files.length > 0 ? fileInput.files[0].name : null;

    const dialogueCard = document.createElement("div");
    dialogueCard.className = "dialogue-card";

    const userPromptDiv = document.createElement("div");
    userPromptDiv.className = "user-prompt";

    if (attachedFileName) {
        const fileTag = document.createElement("div");
        fileTag.className = "chat-file-tag";
        fileTag.innerHTML = `<img class="added-file-icon" src="../static/img/code.png"><span>${attachedFileName}</span>`;
        userPromptDiv.appendChild(fileTag);
    }

    const stageBadge = document.createElement("div");
    stageBadge.className = "chat-stage-badge";
    stageBadge.textContent = `Stage ${currentStage}`;
    userPromptDiv.appendChild(stageBadge);

    const userText = document.createElement("span");
    userText.textContent = userPrompt;
    userPromptDiv.appendChild(userText);

    const aiResponseDiv = document.createElement("div");
    aiResponseDiv.className = "ai-response";
    aiResponseDiv.innerHTML = `Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;

    dialogueCard.appendChild(userPromptDiv);
    dialogueCard.appendChild(aiResponseDiv);
    chatContainer.appendChild(dialogueCard);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    isAiTyping = true;
    updateSendButton();

    promptBar.value = '';
    promptBar.style.height = "auto";
    fileInput.value = '';
    addedFile.style.display = 'none';
    updateSendButton();

    try {
        const response = await fetch("/analyze", { method: "POST", body: formData });
        const data = await response.json();

        if (currentStage === 1 || currentStage === 2) sessionHints++;

        if (currentStage === 2 && data.feedback) {
            const failMatches = data.feedback.match(/FAILED/g);
            if (failMatches) sessionFailedTests = failMatches.length;
        }

        streamline_text(aiResponseDiv, data.feedback, 0, () => {
            isAiTyping = false;
            updateSendButton();
            chatContainer.scrollTop = chatContainer.scrollHeight;

            if (currentStage === 3) {
                // Record Stage 3 time
                if (stageStartTime) {
                    stageTimes[3] += Math.round((Date.now() - stageStartTime) / 1000);
                }
                markCompleted(challengeChosen);
                logSession();
                setTimeout(() => showSummary(), 800);
            }
        });

        chatHistory.push({ role: "user", content: userPrompt, stage: currentStage, fileName: attachedFileName || 'NO-FILE', challenge: challengeChosen, timestamp: Date.now() });
        chatHistory.push({ role: "assistant", content: data.feedback, stage: currentStage, timestamp: Date.now() });

    } catch (error) {
        aiResponseDiv.textContent = "Something went wrong.";
        console.error("Error:", error);
        isAiTyping = false;
        updateSendButton();
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// Log session to server
async function logSession() {
    await fetch("/log_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            challenge: challengeChosen,
            pre_check_answer: preCheckAnswerText,
            hints_received: sessionHints,
            tests_failed: sessionFailedTests,
            time_stage1_seconds: stageTimes[1],
            time_stage2_seconds: stageTimes[2],
            time_stage3_seconds: stageTimes[3]
        })
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// Session summary
function showSummary() {
    sessionSummary.style.display = 'flex';
    promptBarContainer.style.display = 'none';

    const totalTime = stageTimes[1] + stageTimes[2] + stageTimes[3];
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const doneCount = getCompleted().length;
    const totalChallenges = Object.keys(tasks).length;

    summaryStats.innerHTML = `
        <div class="summary-stat"><span class="stat-number">${sessionHints}</span><span class="stat-label">hints received</span></div>
        <div class="summary-stat"><span class="stat-number">${sessionFailedTests}</span><span class="stat-label">tests failed</span></div>
        <div class="summary-stat"><span class="stat-number">${timeStr}</span><span class="stat-label">time spent</span></div>
        <div class="summary-stat"><span class="stat-number">${doneCount}/${totalChallenges}</span><span class="stat-label">challenges done</span></div>
    `;
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// Typewriter — 3 chars per tick at 15ms (~6x faster than 1 char/20ms)
function streamline_text(element, text, i = 0, onComplete = null) {
    if (i === 0) element.textContent = "";

    const end = Math.min(i + 3, text.length);
    element.textContent += text.slice(i, end);

    if (end >= text.length) {
        element.innerHTML = marked.parse(text);
        element.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        if (onComplete) onComplete();
        return;
    }

    setTimeout(() => streamline_text(element, text, end, onComplete), 15);
}
