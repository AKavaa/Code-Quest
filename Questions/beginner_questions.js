const BEGINNER_SECTION_QUESTIONS_JSON = '../beginner_section_questions.json';

let locked_questions = {};
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Get the difficulty from the current page URL
function getDifficulty() {
    const path = window.location.pathname;
    console.log("Current path:", path); // DEBUG

    if (path.includes('first_box')) return 'iq_questions';
    if (path.includes('second_box')) return 'basic_questions';
    if (path.includes('third_box')) return 'fundamentals';

    return 'iq_questions';  // default fallback
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {

    loadQuestionsFromJSON();
});

// Load questions from JSON file
function loadQuestionsFromJSON() {
    console.log("Fetching questions from:", BEGINNER_SECTION_QUESTIONS_JSON); // DEBUG

    fetch(BEGINNER_SECTION_QUESTIONS_JSON)
        .then(response => {
            console.log("Response status:", response.status); // DEBUG
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data); // DEBUG
            locked_questions = data;
            loadQuestionsForDifficulty();
        })
        .catch(error => {
            console.error("Error loading questions:", error);
            displayError("Failed to load questions. Please try again. Error: " + error.message);
        });
}

// Load and display questions for the current difficulty
function loadQuestionsForDifficulty() {
    const difficulty = getDifficulty();
    console.log("Loading difficulty:", difficulty); // DEBUG

    currentQuestions = locked_questions[difficulty] || [];
    console.log("Questions found:", currentQuestions.length); // DEBUG

    currentQuestionIndex = 0;
    score = 0;
    displayCurrentQuestion();
}

// Display the current question (HANDLES BOTH INPUT AND MULTIPLE CHOICE)
function displayCurrentQuestion() {
    if (!currentQuestions.length) {
        displayError("No questions available for this difficulty level.");
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    const questionContainer = document.querySelector('.question-container');

    if (!questionContainer) {
        console.error('Question container not found!');
        return;
    }

    console.log("Displaying question:", question); // DEBUG

    // Check if question has options (multiple choice) or not (input)
    const isMultipleChoice = question.options && question.options.length > 0;

    if (isMultipleChoice) {
        // Multiple choice question
        questionContainer.innerHTML = `
            <h2>Question ${currentQuestionIndex + 1} of ${currentQuestions.length}</h2>
            <p class="question">${question.question}</p>
            <div class="options">
                ${question.options.map((option, index) => `
                    <button class="option-btn" onclick="checkAnswer(${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
            <p class="score">Score: ${score}</p>
        `;
    } else {
        // Input text question
        questionContainer.innerHTML = `
            <h2>Question ${currentQuestionIndex + 1} of ${currentQuestions.length}</h2>
            <p class="question">${question.question}</p>
            <div class="input-container">
                <input type="text" id="answer-input" class="answer-input" placeholder="Type your answer here" />
                <button class="submit-btn" onclick="checkTextAnswer()">Submit</button>
            </div>
            <p class="score">Score: ${score}</p>
        `;
    }
}

// Check the selected answer (for multiple choice)
function checkAnswer(selectedIndex) {
    const question = currentQuestions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll('.option-btn');

    optionButtons.forEach(button => button.disabled = true);

    if (selectedIndex === question.answer) {
        score++;
        optionButtons[selectedIndex].classList.add('correct');
    } else {
        optionButtons[selectedIndex].classList.add('wrong');
        optionButtons[question.answer].classList.add('correct');
    }

    setTimeout(() => {
        moveToNextQuestion();
    }, 1500);
}

// Check text input answer
function checkTextAnswer() {
    const question = currentQuestions[currentQuestionIndex];
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = question.answer.toString().toLowerCase();

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    input.disabled = true;

    if (userAnswer === correctAnswer) {
        score++;
        input.style.borderColor = '#4CAF50';
        input.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
    } else {
        input.style.borderColor = '#f44336';
        input.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';

        // Show correct answer after a brief delay
        setTimeout(() => {
            input.value = `Correct: ${question.answer}`;
        }, 500);
    }

    setTimeout(() => {
        moveToNextQuestion();
    }, 2500);
}

// Move to the next question or end the quiz
function moveToNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
    } else {
        displayCurrentQuestion();
    }
}

// End the quiz and display the final score
function endQuiz() {
    const questionContainer = document.querySelector('.question-container');
    const percentage = (score / currentQuestions.length) * 100;

    questionContainer.innerHTML = `
        <div class="quiz-complete">
            <h2>🎉 Quiz Completed!</h2>
            <p>Your final score: ${score} out of ${currentQuestions.length}</p>
            <p>Percentage: ${percentage.toFixed(2)}%</p>
            <button onclick="window.location.href='./main_page.html'" class="restart-btn">
                Back to Main Section
            </button>
        </div>
    `;
}

// Display error message
function displayError(message) {
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="window.location.href='./main_page.html'" class="back-btn">
                    Back to Main Section
                </button>
            </div>
        `;
    }
}