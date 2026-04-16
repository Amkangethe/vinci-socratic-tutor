//------------------------------------------------------------------------------------------------------------------------------------------------
// Challenges
const tasks = {
    count_vowels: {
        concepts: ["strings", "loops", "conditionals"],
        description: "Count how many vowels appear in a given string."
    },
    dedupe: {
        concepts: ["lists", "sorting", "iteration"],
        description: "Remove repeated values from a list and keep only unique items."
    },
    fizzbuzz: {
        concepts: ["loops", "modulo", "conditionals"],
        description: "Return Fizz, Buzz, or FizzBuzz based on divisibility rules."
    },
    is_palindrome: {
        concepts: ["strings", "slicing", "comparison"],
        description: "Check whether a word or phrase reads the same backward."
    },
    letter_grade: {
        concepts: ["conditionals", "comparison ranges", "returning values"],
        description: "Convert a numeric score into its matching letter grade."
    },
    my_max: {
        concepts: ["lists", "iteration", "comparison"],
        description: "Find and return the largest value in a list."
    }
};

const challanges = document.getElementById('challenge-container');

let challangesHTML = ''
let challengeChosen = '';
let chatHistory = [];

// Show challenges
Object.keys(tasks).forEach(key => {

    challangesHTML += 
    `
    <div class="challenge-card" data-name="${key}">
        <div class="card-top">
            <img class="challenge-img" src="../static/img/python.png">
            <div>
                <p class="challenge-name">${key}</p>
                <p>${tasks[key].description}</p>
            </div>
        </div>
        <button class="challenge-button" data-name="${key}">
            <img class="right-arrow-icon" src="../static/img/right-arrow.png">
        </button>
    </div>
    `
});

challanges.innerHTML = challangesHTML;


const promptBarContainer = document.getElementById('prompt-bar-container');
const challenges = document.getElementById('challenges');
const tempChatContainer = document.getElementById('chat-container');
const chatHeader = document.getElementById('chat-header');
const nextStageBtn = document.getElementById('next-stage-btn');

promptBarContainer.style.display = 'none';
tempChatContainer.style.display = 'none';
chatHeader.style.display = 'none';

let currentStage = 1;

function updateStageUI() {
    [1, 2, 3].forEach(n => {
        const pill = document.getElementById(`stage-pill-${n}`);
        pill.classList.toggle('active', n === currentStage);
        pill.classList.toggle('completed', n < currentStage);
    });

    if (currentStage === 2) {
        nextStageBtn.textContent = 'Get Solution →';
    }
    nextStageBtn.style.display = currentStage === 3 ? 'none' : '';
}

nextStageBtn.addEventListener('click', () => {
    currentStage++;
    updateStageUI();

    if (currentStage === 3) {
        sendMessage("Give me the complete solution.");
    }
});

const buttons = document.querySelectorAll('.challenge-button');
// Get choice
buttons.forEach((button) => {
    button.addEventListener('click', async function(event) {
        promptBarContainer.style.display = '';
        tempChatContainer.style.display = '';
        chatHeader.style.display = '';
        challenges.style.display = 'none';

        currentStage = 1;
        updateStageUI();
        hasUploadedAttempt = false;

        challengeChosen = event.currentTarget.dataset.name;

        fetch("/reset", { method: "POST" });
    });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// textarea
const promptBar = document.getElementById("promptTextArea"); // textarea element

promptBar.addEventListener("input", function () {
    promptBar.style.height = "auto";  // first reset the height
    promptBar.style.height = promptBar.scrollHeight + "px"; //set the height equal to however tall the content needs to be
    updateSendButton();
});

promptBar.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});
//------------------------------------------------------------------------------------------------------------------------------------------------
// upload button 
const fileInput = document.getElementById("fileInput"); // get whatever file the user provided
const addedFile = document.getElementById('promptAddedFile'); //added file id
addedFile.style.display = 'none';

// Display added file
fileInput.addEventListener('change', (event) => {
    
    const file = event.target.files;
   
    addedFile.style.display = '';

    addedFile.innerHTML =
        `
        <img class="added-file-icon" src="../static/img/code.png">
        <div style="
        padding-left: 10px;">
            <p class="file-name-text">${file[0].name}</p>
            <p class="document-text">Python File</p>
        </div>
        `;
});


const sendBtn = document.getElementById('sendButton'); // send button

let hasUploadedAttempt = false;
let isAiTyping = false;

function updateSendButton() {
    const hasText = promptBar.value.trim().length > 0;
    sendBtn.style.display = (hasText && !isAiTyping) ? '' : 'none';
}

updateSendButton(); // hidden on load since textarea is empty

sendBtn.addEventListener('click', () => {
    const userPrompt = promptBar.value;
    if (!userPrompt.trim()) return;

    if (fileInput.files.length > 0) {
        hasUploadedAttempt = true;
    }

    if (!hasUploadedAttempt) {
        alert('PLEASE ENTER A PYTHON FILE TO BEGIN');
        return;
    }

    sendMessage(userPrompt);
});

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

    // Build user bubble
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

    // Clear inputs immediately
    promptBar.value = '';
    promptBar.style.height = "auto";
    fileInput.value = '';
    addedFile.style.display = 'none';
    updateSendButton();

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        streamline_text(aiResponseDiv, data.feedback, 0, () => {
            isAiTyping = false;
            updateSendButton();
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });

        chatHistory.push({
            role: "user",
            content: userPrompt,
            stage: currentStage,
            fileName: attachedFileName || 'NO-FILE',
            challenge: challengeChosen,
            timestamp: Date.now()
        });

        chatHistory.push({
            role: "assistant",
            content: data.feedback,
            stage: currentStage,
            timestamp: Date.now()
        });

    } catch (error) {
        aiResponseDiv.textContent = "Something went wrong.";
        console.error("Error:", error);
        isAiTyping = false;
        updateSendButton();
    }
}

function streamline_text(element, text, i = 0, onComplete = null)
{
    if(i == 0)
    {
        element.textContent = "";
    }

    element.textContent += text[i];

    if(i === text.length - 1)
    {
        element.innerHTML = marked.parse(text);
        if (onComplete) onComplete();
        return;
    }

    setTimeout(() => streamline_text(element, text, i+1, onComplete), 20);
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// chat

