


const QUESTIONS_PRACTICE_JSON = '../Questions/practice_questions.json';

const container = document.getElementById('questions-container');


let currentQuestions = [];
let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-practice').addEventListener('click', async () => {
        document.getElementById('start-practice').style.display = 'none';

        await load_questions();

    });

});

// load questiosn from the JSON file and display them inside HTML element
// asynch function to handle operations one by one and more readable
async function load_questions() {
    try {
        const response = await fetch(QUESTIONS_PRACTICE_JSON);
        if (!response.ok) {
            throw new Error('Failed to fetch Questions');
        }
        currentQuestions = await response.json();
        display_current_questions();
    } catch (error) {
        console.log('Error when loading questions', error);
        container.innerHTML = "<p> Failed to Load Questions </p>";
    }
}



function display_current_questions() {

    if (currentQuestionIndex >= currentQuestions.length) {
        container.innerHTML = `
        <h3> 🎉 Practice level Completed! </h3>
        `;
        return;
    }

    const question = currentQuestions[currentQuestionIndex];

    if (question.options && question.question.length > 0) {
        // for multiple choice questions

        container.innerHTML = `

       <h2>Question ${currentQuestionIndex + 1}: ${question.question}</h2>
            <div class="options">
                ${question.options.map((opt, i) => `<button onclick="checkAnswer(${i})">${opt}</button>`).join('')}
            </div>
    
    `;

    } else {
        container.innerHTML = `

       <h2>Question ${currentQuestionIndex + 1}: ${question.question}</h2>
       <input type="text" id="answer-input" placeholder="Type your answer">
       <button id="submit-answer">Submit</button>
       `;

        // if question correct color gets green inside the user's input placeholder 
        // if question correct color gets red inside the user's input placeholder 
        document.getElementById('submit-answer').addEventListener('click', () => {
            const input = document.getElementById('answer-input');
            const user_answer = input.value.trim();
            if (user_answer.toLowerCase() === question.answer.toString().toLowerCase()) {
                // green
                input.style.borderColor = "#4CAF50";

            } else {
                // red
                input.style.borderColor = "#f44336";
                input.value = `Correct: ${question.answer}`;

            }
            currentQuestionIndex++;

            // move to next question after 1.5 secs
            setTimeout(display_current_questions, 1500)


        });

    }



}


// function checks the multiple choice asnwers if correct or wrong
function checkAnswer(selectedIndex) {

    const question = currentQuestions[currentQuestionIndex];
    const buttons = container.querySelectorAll('button');

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === question.answer) {
        buttons[selectedIndex].style.backgroundColor = '#4CAF50'
    } else {
        buttons[selectedIndex].style.backgroundColor = '#f44336';
        buttons[question.answer].style.backgroundColor = '#4CAF50';


    }
    setTimeout(() => {
        currentQuestionIndex++;
        display_current_questions();
    }, 1500);

    // move to next question after 1.5 secs
    setTimeout(display_current_questions, 1500)
}

