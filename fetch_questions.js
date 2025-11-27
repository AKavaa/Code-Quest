

// Variables holding the JSON file path so they can be used to fetch questions appropriately
const QUESTIONS_JSON_IQ = '../Questions/questions_iq.json';
const QUESTIONS_JSON_KNOWLEDGE = '../Questions/general_knowledge_questions.json';
const QUESTIONS_JSON_PROGRAMMING = '../Questions/questions_programming.json';

let locked_questions = {};
let currentQuestions = [];
let currentQuestionIndex = 0;

let score = 0;

let correct_count = 0;
let worng_count = 0;

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

    return 'beginner' // default section 
}