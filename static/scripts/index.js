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


promptBarContainer.style.display = 'none';
tempChatContainer.style.display = 'none';


const buttons = document.querySelectorAll('.challenge-button');
// Get choice
buttons.forEach((button) => {
    button.addEventListener('click', async function(event)  {
        promptBarContainer.style.display = '';
        tempChatContainer.style.display = '';
        challenges.style.display = 'none';

        challengeChosen = event.currentTarget.dataset.name;
    });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// textarea
const promptBar = document.getElementById("promptTextArea"); // textarea element

promptBar.addEventListener("input", function () {
    promptBar.style.height = "auto";  // first reset the height
    promptBar.style.height = promptBar.scrollHeight + "px"; //set the height equal to however tall the content needs to be
    
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

sendBtn.addEventListener('click', async function () {
    const chatContainer = document.getElementById('chat-container');
    const userPrompt = promptBar.value;

    const formData = new FormData();
    formData.append("prompt", userPrompt);
    formData.append("choice", challengeChosen);

    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
        hasUploadedAttempt = true;
    }

    if (hasUploadedAttempt == false) {
        alert('PLEASE ENTER A PYTHON FILE TO BEGIN');
        return;
    }

    const dialogueCard = document.createElement("div");
    dialogueCard.className = "dialogue-card";

    const userPromptDiv = document.createElement("div");
    userPromptDiv.className = "user-prompt";
    userPromptDiv.textContent = userPrompt;

    const aiResponseDiv = document.createElement("div");
    aiResponseDiv.className = "ai-response";
    aiResponseDiv.textContent = "Thinking...";

    dialogueCard.appendChild(userPromptDiv);
    dialogueCard.appendChild(aiResponseDiv);
    chatContainer.appendChild(dialogueCard);

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        

        streamline_text(aiResponseDiv, data.feedback);

        chatHistory.push({
            role: "user",
            content: userPrompt,
            fileName: fileInput.files[0]?.name || 'NO-FILE',
            challenge: challengeChosen,
            timestamp: Date.now()
        });

        chatHistory.push({
            role: "assistant",
            content: data.feedback,
            timestamp: Date.now()
        });

 

        promptBar.value = '';
        promptBar.style.height = "auto";
        fileInput.value = '';
        addedFile.style.display = 'none';

    } catch (error) {
        aiResponseDiv.textContent = "Something went wrong.";
        console.error("Error:", error);
    }
});

function streamline_text(element, text, i = 0)
{
    if(i == 0)
    {
        element.textContent = "";
    }

    element.textContent += text[i];

    if(i=== text.length - 1)
    {
        return;
    }

    setTimeout(() => streamline_text(element, text, i+1), 20);


}

//------------------------------------------------------------------------------------------------------------------------------------------------
// chat

