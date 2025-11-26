const summary_templates = [
    {
        id: 'correct', label: 'Correct answers', icon: 'fa-check-circle', accessor: stats => stats.correct
    },
    {
        id: 'wrong', label: 'Wrong answers', icon: 'fa-times-circle', accessor: stats => stats.wrong
    },

];


document.addEventListener('DOMcontentLoaded', () => {
    renderProfile();
});

// Renders the needed section for the profileo so the user can see their stats
function profileRender() {
    const playerName = document.getElementById('player_name');
    const profileSummary = document.getElementById('profile_summary');
    const stateOfquiz = document.getElementById('emptyState');
    const username = localStorage.localStor
}