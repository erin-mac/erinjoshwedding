// Meatball cursor follower with heart trail effect
(function() {
    // Create Meatball cursor element
    const meatball = document.createElement('div');
    meatball.className = 'meatball-cursor';
    meatball.innerHTML = '<img src="images/meatball-cursor.png" alt="Meatball">';
    document.body.appendChild(meatball);

    // Track cursor position
    let mouseX = 0;
    let mouseY = 0;
    let meatballX = 0;
    let meatballY = 0;

    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow animation
    function animate() {
        // Lerp for smooth following
        const speed = 0.15;
        meatballX += (mouseX - meatballX) * speed;
        meatballY += (mouseY - meatballY) * speed;

        meatball.style.left = meatballX + 'px';
        meatball.style.top = meatballY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Create heart trail
    let lastHeartTime = 0;
    const heartInterval = 150; // milliseconds between hearts

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastHeartTime > heartInterval) {
            createHeart(e.clientX, e.clientY);
            lastHeartTime = now;
        }
    });

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'cursor-heart';
        heart.textContent = '❤️';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';

        // Random slight offset
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        heart.style.setProperty('--random-x', randomX + 'px');
        heart.style.setProperty('--random-y', randomY + 'px');

        document.body.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Show default cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.style.cursor = 'pointer';
            meatball.style.display = 'none';
        });
        el.addEventListener('mouseleave', () => {
            document.body.style.cursor = 'none';
            meatball.style.display = 'block';
        });
    });
})();
