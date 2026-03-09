// --- Splash Screen Code ---
const splash = document.getElementById('splash');
const splashLogo = document.getElementById('splash-logo');
const authContainer = document.getElementById('auth-container');

function startSplash() {
    if (!splash) return;
    splash.classList.add('ready');
    const delayMs = 2000;
    setTimeout(() => {
        splash.classList.add('done');
        splash.addEventListener('transitionend', () => {
            authContainer?.classList.add('visible');
            splash.remove();
        }, { once: true });
    }, delayMs);
}

if (splashLogo) {
    if (splashLogo.complete) {
        requestAnimationFrame(startSplash);
    } else {
        splashLogo.addEventListener('load', () => requestAnimationFrame(startSplash), { once: true });
    }
    setTimeout(() => {
        if (splash && !splash.classList.contains('ready')) startSplash();
    }, 200);
}