let active_category = null;




document.addEventListener('DOMContentLoaded', () => {
    render_profile();
    category_filters();
    reset_button();

});

// Renders the needed section for the profileo so the user can see their stats
// function profileRender() {
//     const playerName = document.getElementById('player_name');
//     const profileSummary = document.getElementById('profile_summary');
//     const stateOfquiz = document.getElementById('emptyState');
//     // local storage saves the name and displays is appropriately 
//     const username = localStorage.getItem("username");
//     localStorage.setItem("username", username);
//     const categoryContainer = document.getElementById('category_stats');

// document.addEventListener('DOMContentLoaded', () => {
//     render_profile();
// });


function render_profile() {
    const username = localStorage.getItem("username");

    const playerName = document.getElementById('player_name');
    const profileSummary = document.getElementById('profile_summary');
    const stateOfquiz = document.getElementById('emptyState');
    const categoryContainer = document.getElementById('category_stats');

    if (!playerName) {
        return;
    }
    playerName.textContent = username;

    if (username === "Guest") {
        stateOfquiz?.classList.remove('hidden');
        profileSummary.innerHTML = " ";
        categoryContainer.innerHTML = " ";
        return;

    }


    // hide the state wehn the user inputs and exists
    stateOfquiz?.classList.add('hidden');


    // load the stats from local storage 
    const stats = JSON.parse(localStorage.getItem("quiz_stats"));
    if (!stats) return;


    display_stats();


}

const storedStats = profile_wind.getUserStats(username);
const userStats = storedStats || profile_wind.createEmptyUserStats();
const summary = buildSummary(userStats);

renderSummaryCards(profileSummary, summary);
renderCategoryCards(categoryContainer, userStats);


function buildSummary(userStats) {
    let correct = 0;
    let wrong = 0;

    Object.values(userStats).forEach(category => {
        Object.values(category).forEach(difficulty => {
            correct += difficulty.correct || 0;
            wrong += difficulty.wrong || 0;
        });
    });

    const totalAnswered = correct + wrong;


    return {
        correct,
        wrong,
    };


}

function reset_button() {
    const resetbutton = document.getElementById('reset_progress');
    if (!resetbutton) return;


    resetbutton.addEventListener('click', () => {
        // user has the decision to continue if sure, if the users wants to start again and the current stats to dissapear 
        const shouldResetButton = confirm('Do you want to reset your progress?');
        if (!shouldResetButton) return;


        // removes the stats inside the local storage 
        localStorage.removeItem("quiz_stats");

        // display nothing because it was reset and the value is null 
        displayStats(active_category);

        alert("stats have been reset!")


    })

}

function category_filters() {
    const category_buttons = document.querySelectorAll('.category-btn');
    if (!category_buttons.length) {
        displayStats();
        return;

    }

    category_buttons.forEach((category_buttons)), () => {
        category_buttons.addEventListener('click', () => {
            const category = category_buttons.dataset.categoty;
            if (!category)
                return;
            current_category = category;
            category_buttons.forEach(btn => btn.classList.toggle('active', btn == category_buttons));
            displayStats(active_category);

        });
    };

    category_buttons[0].click();

}
function display_stats(category) {
    const container = document.getElementById('stats-container');
    const quizStats = JSON.parse(localStorage.getItem('quiz_stats'));


    if (!container) return;


    let category_data;

    if (category && quizStats[category]) {
        category_data = { [category]: quizStats[category] };

    } else {

        category_data = quizStats;
    }



    let html = '';
    for (const [categoryName, levels] of Object.entries(category_data)) {
        html += `<h2>${formatCategoryLabel(categoryName)}</h2>`;
        html += '<table><tr><th>Level</th><th>Correct</th><th>Wrong</th><th>Total</th></tr>';

        for (const [level, stats] of Object.entries(levels)) {
            const total = stats.correct + stats.wrong;
            html += `
                <tr>
                    <td>${capitalize(level)}</td>
                    <td>${stats.correct}</td>
                    <td>${stats.wrong}</td>
                    <td>${total}</td>
                </tr>
            `;

        }

        html += '</table>';

    }
    container.innerHTML = html;


}