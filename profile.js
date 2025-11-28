let active_category = null;


const summary_templates = [
    {
        id: 'correct', label: 'Correct answers', icon: 'fa-check-circle', accessor: stats => stats.correct
    },
    {
        id: 'wrong', label: 'Wrong answers', icon: 'fa-times-circle', accessor: stats => stats.wrong
    },

];


document.addEventListener('DOMContentLoaded', () => {
    render_profile();

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

document.addEventListener('DOMContentLoaded', () => {
    render_profile();
});


function render_profile() {
    const username = localStorage.getItem("username");
    document.getElementById("player_name").textContent = username ? username : "Guest";

    if (!playerName || !profileSummary || !categoryContainer || !stateOfquiz) {
        return;
    }

    if (!username) {
        playerName.textContent = 'Guest player';
        profileSummary.innerHTML = '';
        categoryContainer.innerHTML = '';
        stateOfquiz.classList.remove('hidden');
        return;
    }

    playerName.textContent = username;
    // hide the state wehn the user inputs and exists
    stateOfquiz.classList.add('hidden');

    const profile_wind = window.CodeQuestProfile;
    if (!profile_wind) {
        return;
    }



    const storedStats = profile_wind.getUserStats(username);
    const userStats = storedStats || profile_wind.createEmptyUserStats();
    const summary = buildSummary(userStats);

    renderSummaryCards(profileSummary, summary);
    renderCategoryCards(categoryContainer, userStats);
}


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
    const accuracy = totalAnswered ? Math.round((correct / totalAnswered) * 100) : 0;

    return {
        correct,
        wrong,
    };


}

