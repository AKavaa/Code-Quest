function startGame() {
    // variable username to compare if user exists or not
    const username = document.getElementById('username').value.trim();


    // verify that the user inputs a valdi username and not blank 
    if (username === "") {
        alert("Please enter a valid Username to start!");
        return 0;
    }

    // save username in the local storage
    localStorage.setItem("username", username);

    window.location.href = "./difficulty.html";
}



