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

sendBtn.addEventListener('click', async function ()  { // once user clicks send
    const formData = new FormData(); // data like files or text that was sent
    formData.append("prompt", promptBar.value);   // add prompt to data
    promptBar.value = '';

    if (fileInput.files.length > 0) {   // if there was a file uploaded
        formData.append("file", fileInput.files[0]); // add file to data
    }

    try
    {
        const response = await fetch("/analyze", {  // send data to analyze function
            method: "POST",
            body: formData
        });

        const data = await response.json();  // data
        
        addedFile.style.display = 'none';

        console.log(data);
        document.getElementById('welcome').innerHTML = data.this;

        
    
    }catch(error)  // if error
    {
        console.error("Error:", error);
    }

});