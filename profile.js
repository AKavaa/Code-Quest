let active_category = null;

document.addEventListener('DOMContentLoaded', () => {
    render_profile();
    category_filters();
    reset_button();
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


// ================== RESET BUTTON ==================
function reset_button() {
    const resetbutton = document.getElementById('reset_progress');
    if (!resetbutton) return;

    resetbutton.addEventListener('click', () => {
        if (!confirm("Reset ALL statistics?")) return;

        localStorage.removeItem("quiz_stats");
        display_stats(active_category); // refresh UI
        alert("Progress reset successfully!");
    });
}


// ================== CATEGORY FILTER BUTTONS ==================
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


// ================== DISPLAY STATS TABLE ==================
function display_stats(category) {
    const container = document.getElementById('stats-container');
    const stats = JSON.parse(localStorage.getItem("quiz_stats"));
    if (!container || !stats) return;

    const data = category ? { [category]: stats[category] } : stats;

    let html = "";
    for (const [cat, levels] of Object.entries(data)) {
        html += `<h2>${cat.toUpperCase()}</h2>`;
        html += `<table>
                    <tr><th>Level</th><th>Correct</th><th>Wrong</th><th>Total</th></tr>`;

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