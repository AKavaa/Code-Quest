

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

function render_profile() {
    const username = localStorage.getItem("username");
    document.getElementById("player_name").textContent = username ? username : "Guest";
}