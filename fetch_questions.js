

// Variables holding the JSON file path so they can be used to fetch questions appropriately
const QUESTIONS_JSON_IQ = '../Questions/questions_iq.json';
const QUESTIONS_JSON_KNOWLEDGE = '../Questions/general_knowledge_questions.json';
const QUESTIONS_JSON_PROGRAMMING = '../Questions/questions_programming.json';

let locked_questions = {};
let currentQuestions = [];
let currentQuestionIndex = 0;

let score = 0;

let correct_count = 0;
let wrong_count = 0;

document.addEventListener('DOMContentLoaded', () => {
    render_profile();
});

// event listener so the DOM is loading the username with the render_profile function
function render_profile() {
    const username = localStorage.getItem("username");
    document.getElementById("player_name").textContent = username ? username : "Guest";
};


// the stats are saved inside the local storage and after displayed
let quiz_stats = JSON.parse(localStorage.getItem("quiz_stats")) || {
    iq: { beginner: { correct: 0, wrong: 0 }, intermediate: { correct: 0, wrong: 0 }, advanced: { correct: 0, wrong: 0 } },
    knowledge: { beginner: { correct: 0, wrong: 0 }, intermediate: { correct: 0, wrong: 0 }, advanced: { correct: 0, wrong: 0 } },
    programming: { beginner: { correct: 0, wrong: 0 }, intermediate: { correct: 0, wrong: 0 }, advanced: { correct: 0, wrong: 0 } }
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
    if (path.includes('first_box') || path.includes('beginner')) return 'beginner';
    if (path.includes('second_box') || path.includes('intermediate')) return 'intermediate';
    if (path.includes('third_box') || path.includes('advanced')) return 'advanced';

    return 'beginner'; // default section 
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
            fetch(QUESTIONS_JSON_KNOWLEDGE),
            fetch(QUESTIONS_JSON_PROGRAMMING)
        ]);
        // looping through the JSONd and checking if the questions are fetched ok
        const data = await Promise.all(responses.map(r => {
            if (!r.ok) throw new Error(`HTTP error ${r.status}`);
            return r.json();
        }));

        // 0 -> IQ Questions
        // 1 -> knowledge Questions
        // 2 -> programming Questions
        locked_questions = {
            iq: data[0].iq_questions || [],
            knowledge: data[1].general_knowledge_questions || [],
            programming: data[2].programming_questions || []
        };
    }
    catch (err) {
        console.log("Failed to load all the questions", err);
    }

}


function load_questions_for_difficulty() {
    const category = getCategory();
    const difficulty = getCategory();


    // questions are being stores inside the variabkle, and selects those that mathch the current level
    // and diffiuclty
    currentQuestions = locked_questions[category].filter(q => q.level === difficulty);

    currentQuestionIndex = 0;
    score = 0;
    wrong_count = 0;
    correct_count = 0;



    if (!currentQuestions.length) {
        displayError(` There are no questions found for the category "${catgory}" and level "${difficulty}"`);
        return; display_current_questions();
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


    if (!container)
        return;

    // storing the multiple choice questions
    const is_multiple_choice = question.options && question.options.length > 0;

    if (!is_multiple_choice) {

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

    const input = document.getElementById('.answer-input');

    const user_answer = input.ariaValueMax.trim().toLowerCase();
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

    localStorage.setItem('quiz_stats', JSON.stringify(quiz_stats));
    // move to next question after 2 secs
    setTimeout(moveToNextQuestion, 2000)
}
