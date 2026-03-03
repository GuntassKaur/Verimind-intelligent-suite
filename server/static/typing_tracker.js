/**
 * Typing Speed Tracker
 * Non-intrusive global speed telemetry.
 */

(function () {
    let startTime = null;
    let characterCount = 0;
    let lastInputTime = Date.now();
    let isTracking = false;
    let timerInterval = null;
    let hideTimeout = null;

    let badge = null;
    let speedLabel = null;

    function initUI() {
        if (document.getElementById('typing-indicator-root')) return;

        const root = document.createElement('div');
        root.id = 'typing-indicator-root';
        root.innerHTML = `
            <div class="typing-badge" id="typing-badge" style="display: flex; align-items: center; gap: 10px;">
                <div style="display: flex; gap: 4px;">
                    <div style="width: 4px; height: 4px; border-radius: 50%; background: #6366f1; animation: pulse 1s infinite;"></div>
                    <div style="width: 4px; height: 4px; border-radius: 50%; background: #6366f1; animation: pulse 1s infinite 0.2s;"></div>
                    <div style="width: 4px; height: 4px; border-radius: 50%; background: #6366f1; animation: pulse 1s infinite 0.4s;"></div>
                </div>
                <div class="typing-text" id="typing-speed-value">0 WPM</div>
            </div>
        `;
        document.body.appendChild(root);

        badge = document.getElementById('typing-badge');
        speedLabel = document.getElementById('typing-speed-value');

        // Add minimal animation if not in CSS
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        `;
        document.head.appendChild(style);
    }

    function calculateSpeed() {
        if (!startTime) return;
        const durationMinutes = (Date.now() - startTime) / 60000;
        if (durationMinutes > 0) {
            const wpm = Math.round((characterCount / 5) / durationMinutes);
            speedLabel.innerText = `${wpm} WPM`;
        }
    }

    function showIndicator() {
        if (!badge) initUI();
        badge.classList.add('visible');
    }

    function hideIndicator() {
        if (badge) badge.classList.remove('visible');
        isTracking = false;
        startTime = null;
        characterCount = 0;
        if (timerInterval) clearInterval(timerInterval);
    }

    function handleInput(e) {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.getAttribute('contenteditable') === 'true';
        if (!isInput) return;

        if (!isTracking) {
            isTracking = true;
            startTime = Date.now();
            showIndicator();
            timerInterval = setInterval(calculateSpeed, 1000);
        }

        characterCount++;
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(hideIndicator, 3000);
    }

    document.addEventListener('input', handleInput);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();
