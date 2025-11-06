let locked_questions = {};


// as the Questions are stored in a JSON file the questions are fetched 
// from the path targeting the JSON file
fetch('../Questions/questions.json')
    .then(response => response.json)
    .then(data => {
        locked_questions = data; // storing the questions

        console.log("Questions Loaded :", locked_questions);
    })
    .catch(error => console.log("Error Loading the Questions", error));