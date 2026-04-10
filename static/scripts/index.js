//------------------------------------------------------------------------------------------------------------------------------------------------
// textarea
const promptBar = document.getElementById("promptBar"); // textarea element

promptBar.addEventListener("input", function () {
    promptBar.style.height = "auto";  // first reset the height
    promptBar.style.height = promptBar.scrollHeight + "px"; //set the height equal to however tall the content needs to be
    
});
//------------------------------------------------------------------------------------------------------------------------------------------------
// upload button 
const fileInput = document.getElementById("fileInput"); // get whatever file the user provided
const sendBtn = document.getElementById('sendBtn'); // send button 

sendBtn.addEventListener('click', async function ()  { // once user clicks send
    const formData = new FormData(); // data like files or text that was sent
    formData.append("prompt", promptBar.value);   // add prompt to data

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
            console.log(data);

        document.getElementById('welcome').innerHTML = data.filename;
        
    }catch(error)  // if error
    {
        console.error("Error:", error);
    }

});