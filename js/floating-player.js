// Create floating Spotify player
function createFloatingPlayer() {
    const playerHTML = `
        <div class="floating-player" id="floatingPlayer">
            <div class="player-header">
                <span class="player-title">🎵 Wedding Playlist</span>
                <button class="player-toggle" id="playerToggle">−</button>
            </div>
            <div class="player-content" id="playerContent">
                <iframe
                    style="border-radius:0"
                    src="https://open.spotify.com/embed/playlist/63zRRVQvTCqkvOKWYl9REW?utm_source=generator"
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowfullscreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy">
                </iframe>
            </div>
        </div>
    `;

    // Insert player at beginning of body
    document.body.insertAdjacentHTML('afterbegin', playerHTML);

    // Add toggle functionality
    const playerToggle = document.getElementById('playerToggle');
    const playerContent = document.getElementById('playerContent');

    playerToggle.addEventListener('click', () => {
        playerContent.classList.toggle('collapsed');
        playerToggle.textContent = playerContent.classList.contains('collapsed') ? '+' : '−';
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingPlayer);
} else {
    createFloatingPlayer();
}
