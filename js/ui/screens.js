// js/ui/screens.js

export function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));

    const target = document.getElementById(screenId);
    if (!target) {
        console.warn(`Screen not found: ${screenId}`);
        return;
    }

    target.classList.remove('hidden');
}
