let locked_questions = {};
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Get the difficulty from the current page URL
function getDifficulty() {
    const path = window.location.pathname;
    if (path.includes('beginner')) return 'beginner';
    if (path.includes('intermediate')) return 'intermediate';
    if (path.includes('advanced')) return 'advanced';
    return 'beginner'; // default fallback
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuestionsFromJSON();
});

// Load questions from JSON file
function loadQuestionsFromJSON() {
    fetch('/Code-Quest/Questions/questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data); // Debug log
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
    currentQuestions = locked_questions[difficulty] || [];
    currentQuestionIndex = 0;
    score = 0;
    displayCurrentQuestion();
}

// Display the current question
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
}

// Check the selected answer
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
    }, 1000);
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
        <h2>Quiz Completed!</h2>
        <p>Your final score: ${score} out of ${currentQuestions.length}</p>
        <p>Percentage: ${percentage.toFixed(2)}%</p>
        <button onclick="window.location.href='/Code-Quest/difficulty.html'" class="restart-btn">
            Try Another Difficulty
        </button>
    `;
}

// Display error message
function displayError(message) {
    const questionContainer = document.querySelector('.question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="window.location.href='/Code-Quest/difficulty.html'" class="back-btn">
                    Back to Difficulty Selection
                </button>
            </div>
        `;
    }
}

// Fetch questions from the JSON file
fetch('/Code-Quest//Questions/questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        locked_questions = data;
        console.log("Questions Loaded:", locked_questions);
        loadQuestionsForDifficulty(); // Start loading questions for the current difficulty
    })
    .catch(error => {
        console.error("Error Loading the Questions:", error);
        displayError("Failed to load questions. Please try again later.");
    });
