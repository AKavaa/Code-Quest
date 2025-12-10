// const MAX_SCORE = currentQuestions.length * 20;


// Variables holding the JSON file path so they can be used to fetch questions appropriately
const QUESTIONS_JSON_IQ = '../Questions/questions_iq.json';
// const QUESTIONS_JSON_KNOWLEDGE = '../Questions/general_knowledge_questions.json';
const QUESTIONS_JSON_PROGRAMMING = '../Questions/questions_programming.json';

let locked_questions = {};
let currentQuestions = [];
let currentQuestionIndex = 0;

let score = 0;

let correct_count = 0;
let wrong_count = 0;

function display_highest_score() {
    const h_score = document.getElementById('highest_score'); // add the html element for the function to display 

    if (!h_score) return;

    const stats = JSON.parse(localStorage.getItem('quiz_stats'));
    if (!stats) {

        h_score.textContent = "No high score yet.";
        return;
    }



    let best_score = 0;


    // looping through the categories and the levels
    for (const [category, levels] of Object.entries(stats)) {
        for (const [level, s] of Object.entries(levels)) {
            const score = s.best_score || 0;


            // if the question is correct points become + 20
            // const points = (s.correct || 0) * 20

            if (score > best_score) {
                best_score = score;


            }


        }
    }
    // if it is 0 no high score message is displayed
    h_score.textContent = best_score > 0 ? `New High Score: ${best_score}` : "No high score yet";
}


// event listener so the DOM is loading the username with the render_profile function
document.addEventListener('DOMContentLoaded', () => {
    render_profile();
    display_highest_score();
});


function render_profile() {
    const playerNameElement = document.getElementById("player_name");
    if (!playerNameElement) return;

    const username = localStorage.getItem("username");
    playerNameElement.textContent = username ? username : "Guest";
}

// the stats are saved inside the local storage and after displayed
let quiz_stats = JSON.parse(localStorage.getItem("quiz_stats")) || {
    iq: { beginner: { best_score: 0, correct: 0, wrong: 0 }, intermediate: { best_score: 0, correct: 0, wrong: 0 }, advanced: { best_score: 0, correct: 0, wrong: 0 } },
    knowledge: { beginner: { best_score: 0, correct: 0, wrong: 0 }, intermediate: { best_score: 0, correct: 0, wrong: 0 }, advanced: { best_score: 0, correct: 0, wrong: 0 } },
    programming: { beginner: { best_score: 0, correct: 0, wrong: 0 }, intermediate: { best_score: 0, correct: 0, wrong: 0 }, advanced: { best_score: 0, correct: 0, wrong: 0 } }
};



// this function displays the appropriate category which will be displayed 
function getCategory() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('iq')) return 'iq';
    if (path.includes('knowledge')) return 'knowledge';
    if (path.includes('programming')) return 'programming';

    return 'iq'; // return iq cause its the default setting
};

// function here will display the questions based on the current difficulty the user chooses
function getDifficulty() {
    const path = window.location.pathname.toLowerCase();
    // check the quiz difficulty based on the page name 
    // differnt files use different names so this part determens that
    if (path.includes("first_box")) return "beginner";
    if (path.includes("second_box")) return "intermediate";
    if (path.includes("third_box")) return "advanced";

    if (path.includes("beginner")) return "beginner";
    if (path.includes("intermediate")) return "intermediate";
    if (path.includes("advanced")) return "advanced";

    return "beginner"; // default
}


// Initialiazing the quiz setup
document.addEventListener('DOMContentLoaded', async () => {
    await load_all_questions();
    load_questions_for_difficulty();
});


async function load_all_questions() {
    try {
        const responses = await Promise.all([ // runnign multiple requests in parallel, fetching 
            fetch(QUESTIONS_JSON_IQ),           // from all the JSONs 
            fetch(QUESTIONS_JSON_PROGRAMMING)
        ]);
        // looping through the JSONd and checking if the questions are fetched ok
        const data = await Promise.all(responses.map(r => {
            if (!r.ok) throw new Error(`HTTP error ${r.status}`);
            return r.json();
        }));

        // 0 -> IQ Questions
        // 1 -> programming Questions
        locked_questions = {
            iq: data[0].iq_questions || [],
            knowledge: [], // knowledge questions not implemented yet
            programming: data[1].programming_questions || []
        };
    }
    catch (err) {
        console.log("Failed to load all the questions", err);
    }

}


function load_questions_for_difficulty() {

    const category = getCategory();
    const difficulty = getDifficulty();


    // questions are being stores inside the variabkle, and selects those that mathch the current level
    // and diffiuclty
    currentQuestions = locked_questions[category].filter(q => q.level === difficulty);

    currentQuestionIndex = 0;
    score = 0;
    wrong_count = 0;
    correct_count = 0;

    quiz_stats[category][difficulty].correct = 0;
    quiz_stats[category][difficulty].wrong = 0;

    // local storage doesnt stack up, each time quiz_stats are newly generated
    localStorage.setItem("quiuz_stats", JSON.stringify(quiz_stats));


    if (!currentQuestions.length) {
        displayError(`There are no questions found for the category "${category}" and level "${difficulty}"`);
        return;
    }
    display_current_questions();
}


// function to display the current questions
function display_current_questions() {

    if (!currentQuestions.length)
        return;

    // variable questions gets the current position from the filtred questions list
    const question = currentQuestions[currentQuestionIndex];

    // where the questions will be displayed
    const container = document.querySelector('.question-container');


    if (!container) {
        return;

    }


    // storing the multiple choice questions
    const is_multiple_choice = question.options && question.options.length > 0;

    if (is_multiple_choice) {

        // displays the current questions and its options 

        // checkAnswer function checks if the given answer was correct or wrong and moves to the next question
        container.innerHTML = `
          <h2>Question ${currentQuestionIndex + 1} of ${currentQuestions.length}</h2>
            <p class="question">${question.question}</p>
            <div class="options">
            
                ${question.options.map((opt, i) => `<button class="option-btn" onclick="checkAnswer(${i})">${opt}</button>`).join('')}
            </div>
            <p class="score">Score: ${score}</p>
        `;
    } else {
        container.innerHTML = `
            <h2>Question ${currentQuestionIndex + 1} of ${currentQuestions.length}</h2>
            <p class="question">${question.question}</p>
            <div class="input-container">
                <input type="text" id="answer-input" placeholder="Type your answer"/>
                <button class="submit-btn" onclick="checkTextAnswer()">Submit</button>
            </div>
            <p class="score">Score: ${score}</p>
        `;
    }
}



// function checks the multiple choice asnwers if correct or wrong
// tracks the score and the question's correct or wrong count
// lose or gain points with the score variable
function checkAnswer(selectedIndex) {

    const category = getCategory();
    const difficulty = getDifficulty();
    const question = currentQuestions[currentQuestionIndex];

    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === question.answer) {

        score += 20;
        correct_count++;

        quiz_stats[category][difficulty].correct++;
        buttons[selectedIndex].classList.add('correct');

    } else {
        score -= 10;
        wrong_count++;
        quiz_stats[category][difficulty].wrong++;
        buttons[selectedIndex].classList.add('wrong');
        // highlights the correct answer 
        buttons[question.answer]?.classList.add('correct');
    }
    localStorage.setItem('quiz_stats', JSON.stringify(quiz_stats));
    // move to next question after 1.5 secs
    setTimeout(moveToNextQuestion, 1500)
}


// approximately the same function as above but for the user input
// the logic is the same 
function checkTextAnswer() {

    const category = getCategory();
    const difficulty = getDifficulty();
    const question = currentQuestions[currentQuestionIndex];

    const input = document.getElementById('answer-input');

    const user_answer = input.value.trim().toLowerCase();
    const correct_answer = question.answer.toString().toLowerCase();

    input.disabled = true;
    document.querySelector('.submit-btn').disabled = true;

    if (user_answer === correct_answer) {

        score += 20;
        correct_count++;

        quiz_stats[category][difficulty].correct++;
        input.style.borderColor = '#4CAF50';


    } else {
        score -= 10;
        wrong_count++;
        quiz_stats[category][difficulty].wrong++;
        input.style.borderColor = '#f44336';
        // highlights the correct answer 

        // if the answer was wronf it will show to correct one inside the small input box 
        setTimeout(() => input.value = `Correct: ${question.answer}`, 500)
    }
    localStorage.setItem('quiz_stats', JSON.stringify(quiz_stats));
    // move to next question after 1.5 secs
    setTimeout(moveToNextQuestion, 1500)

    // localStorage.setItem('quiz_stats', JSON.stringify(quiz_stats));
    // // move to next question after 2 secs
    // setTimeout(moveToNextQuestion, 2000)
}

function moveToNextQuestion() {

    currentQuestionIndex++; // move to next question

    // If we have reached the 4th question (index 3) or run out of questions → end quiz
    if (currentQuestionIndex >= currentQuestions.length) {
        end_quiz();
    }
    else {
        display_current_questions(); // show next question
    }
}






function end_quiz() {


    const container = document.querySelector('.question-container');
    const category = getCategory();
    const difficulty = getDifficulty();

    if (score > (quiz_stats[category][difficulty].best_score || 0)) {
        quiz_stats[category][difficulty].best_score = score;
    }

    // this is the text that will be shown at the end of the quixz

    // displays the correct and wrong questions at the end 
    //and calculates the total stats 


    // svaing to the localStorage and after this updates the best_score
    localStorage.setItem('quiz_stats', JSON.stringify(quiz_stats));

    // all the stats of each quiz is being displayed at the end of the completion of the section
    container.innerHTML = `
        <div class="quiz-complete">
            <h2>🎉 Quiz Completed!</h2>
            <p>Your Score: ${score} / 100 </p>

        
            <h3>📘 This Quiz</h3>
            <p>Correct: ${correct_count}</p>
            <p>Wrong: ${wrong_count}</p>

            <h3>📊 Total Stats (${category} - ${difficulty})</h3>
            <p>Total Correct: ${quiz_stats[category][difficulty].correct}</p>
            <p>Total Wrong: ${quiz_stats[category][difficulty].wrong}</p>

        
               <button class="player-btn1" onclick="location.href='../profile.html'">
            <i class="fas fa-user"></i>
            
        </button>

            <button class="back-btn" onclick="window.location.href='../difficulty.html'">Back to Category Selection</button>
        </div>
    `;

    // update the high score each time at the end of the quiz
    display_highest_score();


}


// function of error message showing 
function displayError(message) {
    const container = document.querySelector('.question-container');

    container.innerHTML = `<div class="error-message"> <p> ${message} </p> </div>`;

}