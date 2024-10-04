document.getElementById('submitBtn').addEventListener('click', async function () {
    const question = document.getElementById('questionInput').value;
    
    if (!question) {
        alert("Please enter a question!");
        return;
    }

    // Send question to the server
    const response = await fetch('http://localhost:3000/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });

    const data = await response.json();

    // Display the result in the HTML
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = data["explanation"]
});
