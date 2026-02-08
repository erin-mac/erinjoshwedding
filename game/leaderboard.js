// leaderboard.js — Firebase leaderboard manager
// Depends on: firebase/firestore being initialized (global `db`)

const Leaderboard = (function () {
    const COLLECTION = 'leaderboard';
    const MAX_ENTRIES = 10;
    let unsubscribe = null;

    function startListening() {
        const listEl = document.getElementById('leaderboard-list');
        if (!listEl || typeof db === 'undefined') return;

        unsubscribe = db.collection(COLLECTION)
            .orderBy('score', 'desc')
            .limit(MAX_ENTRIES)
            .onSnapshot(
                function (snapshot) {
                    var entries = [];
                    snapshot.forEach(function (doc) {
                        entries.push({ id: doc.id, ...doc.data() });
                    });
                    renderLeaderboard(entries);
                },
                function (error) {
                    console.error('Leaderboard listener error:', error);
                    listEl.innerHTML =
                        '<div class="leaderboard-empty">Could not load leaderboard</div>';
                }
            );
    }

    function renderLeaderboard(entries) {
        const listEl = document.getElementById('leaderboard-list');
        if (!listEl) return;

        if (entries.length === 0) {
            listEl.innerHTML =
                '<div class="leaderboard-empty">No scores yet. Be the first!</div>';
            return;
        }

        listEl.innerHTML = entries.map(function (entry, index) {
            return '<div class="leaderboard-entry">' +
                '<span class="leaderboard-rank">' + (index + 1) + '.</span>' +
                '<span class="leaderboard-name">' + escapeHtml(entry.name) + '</span>' +
                '<span class="leaderboard-score">' + entry.score + '</span>' +
                '</div>';
        }).join('');
    }

    function submitScore(name, score) {
        return db.collection(COLLECTION).add({
            name: name.trim().substring(0, 20),
            score: score,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function stopListening() {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    }

    return {
        startListening: startListening,
        stopListening: stopListening,
        submitScore: submitScore
    };
})();
