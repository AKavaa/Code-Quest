


const QUESTIONS_PRACTICE_JSON = '../Questions/practice_questions.json';

const container = document.getElementById('questions-container');


// load questiosn from the JSON file and display them inside HTML element
// asynch function to handle operations one by one and more readable
async function load_questions() {
    try {
        const response = await fetch(QUESTIONS_PRACTICE_JSON);
        if (!response.ok) {
            throw new Error('Failed to fetch Questions');
        }
        const questions = await response.json();
        display_current_questions(questions);
    } catch (error) {
        console.log('Error when loading questtions', error);
        container.innerHTML = "<p> Failed to Load Questions </p>";
    }
}



