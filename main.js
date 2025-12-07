function startGame() {
    // variable username to compare if user exists or not
    const username = document.getElementById('username').value.trim();


    // verify that the user inputs a valdi username and not blank 
    if (username === "") {
        alert("Please enter a valid Username to start!");
        return 0;
    }
    // nickname must be less than 9 characters
    if (username.length > 8) {
        alert("Enter a valid nickname below");
        return;
    }

    // save username in the local storage
    localStorage.setItem("username", username);

    window.location.href = "./difficulty.html";
}



