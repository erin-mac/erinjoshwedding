// Persistent audio player that continues across page loads
(function() {
    // Create audio player HTML
    const playerHTML = `
        <div class="persistent-audio-player" id="persistentAudio">
            <button class="audio-toggle" id="audioToggle">
                <span class="audio-icon">🎵</span>
                <span class="audio-text">Play Music</span>
            </button>
        </div>
    `;

    // Insert player
    document.body.insertAdjacentHTML('afterbegin', playerHTML);

    // Create party pointer for first-time visitors
    const partyPointerHTML = `
        <div class="party-pointer" id="partyPointer">
            <div class="party-text">Let's Party!</div>
            <div class="party-arrow">↙</div>
        </div>
    `;

    // Create audio element
    const audio = new Audio();
    // You'll need to add an MP3 file to your site - for now using a placeholder
    audio.src = 'audio/wedding-song.mp3'; // You'll need to add this file
    audio.loop = true;
    audio.volume = 0.5;

    const toggle = document.getElementById('audioToggle');
    const icon = toggle.querySelector('.audio-icon');
    const text = toggle.querySelector('.audio-text');

    // Get saved state from localStorage
    const savedTime = parseFloat(localStorage.getItem('audioTime') || '0');
    const wasPlaying = localStorage.getItem('audioPlaying');

    // Restore audio position
    if (savedTime) {
        audio.currentTime = savedTime;
    }

    // Always show party pointer
    document.body.insertAdjacentHTML('afterbegin', partyPointerHTML);
    const partyPointer = document.getElementById('partyPointer');

    // Hide pointer when music starts playing
    const hidePointer = () => {
        if (partyPointer) {
            partyPointer.classList.add('hidden');
        }
    };

    // Hide when user clicks play
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            hidePointer();
        }
    });

    // Auto-play on first visit or if was playing before
    const shouldAutoPlay = wasPlaying === null || wasPlaying === 'true';

    if (shouldAutoPlay) {
        audio.play().then(() => {
            icon.textContent = '⏸';
            text.textContent = 'Pause Music';
            toggle.classList.add('playing');
            localStorage.setItem('audioPlaying', 'true');
            hidePointer(); // Hide pointer when autoplay succeeds
        }).catch(err => {
            console.log('Autoplay prevented by browser:', err);
            // If autoplay is blocked, keep the pointer visible
        });
    }

    // Toggle play/pause
    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            icon.textContent = '⏸';
            text.textContent = 'Pause Music';
            toggle.classList.add('playing');
            localStorage.setItem('audioPlaying', 'true');
        } else {
            audio.pause();
            icon.textContent = '🎵';
            text.textContent = 'Play Music';
            toggle.classList.remove('playing');
            localStorage.setItem('audioPlaying', 'false');
        }
    });

    // Save position periodically
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('audioTime', audio.currentTime.toString());
        }
    }, 1000);

    // Save state before page unload
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('audioTime', audio.currentTime.toString());
        localStorage.setItem('audioPlaying', audio.paused ? 'false' : 'true');
    });
})();
