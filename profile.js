let active_category = null;

document.addEventListener('DOMContentLoaded', () => {
    render_profile();
    category_filters();
    reset_button();
    display_highest_score();
});


// ================== LOAD USERNAME & SHOW STATS ==================
function render_profile() {
    let username = localStorage.getItem("username") || "Guest";
    const playerName = document.getElementById('player_name');

    playerName.textContent = username;

    const stats = JSON.parse(localStorage.getItem("quiz_stats"));
    if (!stats) return; // no stats saved yet -> avoid errors

    display_stats(); // display all stats by default
}


// ================== SUMMARY HELPER ==================
function buildSummary(userStats) {
    let correct = 0, wrong = 0;


    Object.values(userStats).forEach(category => {
        Object.values(category).forEach(level => {
            correct += level.correct || 0;
            wrong += level.wrong || 0;
        });
    });

    return { correct, wrong };
}

// function to reset the stats 
function reset_button() {
    const resetbutton = document.getElementById('reset_progress');
    if (!resetbutton) return;

    resetbutton.addEventListener('click', () => {
        if (!confirm("Reset ALL your stats?")) return;

        // removes all the info from local storage 
        localStorage.removeItem("quiz_stats");

        display_stats(active_category);
        alert("Progress reset was successful!");

        alert("Refresh the page so the modifications apply!");
    });
}

//
function category_filters() {
    const buttons = document.querySelectorAll('.category-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            active_category = btn.dataset.category;

            buttons.forEach(b => b.classList.toggle("active", b === btn));

            display_stats(active_category);
        });
    });

    buttons[0].click(); // auto select first category
}

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


            // if the question is correct points become + 20
            const points = (s.correct || 0) + 20;

            if (points > best_score) {
                best_score = points;

            }


        }
    }
    h_score.textContent = best_score > 0 ? `Highest Score : ${best_score}` : "No high score yet";
}

// if (s.correct > best_score) {
//                 best_score = s.correct;
//             }

// function to display the stats that were saved inside the local storage
function display_stats(category) {
    // where stats will be displayed
    const container = document.getElementById('stats-container');
    const stats = JSON.parse(localStorage.getItem("quiz_stats"));
    if (!container || !stats) return;

    const data = category ? { [category]: stats[category] } : stats;

    let html = "";
    // cat -> category 
    for (const [cat, levels] of Object.entries(data)) {
        html += `<h2>${cat.toUpperCase()}</h2>`;
        html += `<table>
                    <tr><th>Level</th><th>Correct</th><th>Wrong</th><th>Total</th></tr>`;

        // s -> stats 
        for (const [level, s] of Object.entries(levels)) {
            const total = s.correct + s.wrong;
            html += `
                <tr>
                    <td>${level}</td>
                    <td>${s.correct}</td>
                    <td>${s.wrong}</td>
                    <td>${total}</td>
                </tr>`;
        }

        html += `</table><br>`;
    }

    container.innerHTML = html;
}