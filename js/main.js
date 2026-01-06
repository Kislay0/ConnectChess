
// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render } from './game/renderer.js';
import { initInput } from './game/input.js';

window.showScreen = showScreen;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
    showScreen('menu-screen');

    const canvas = document.getElementById('boardCanvas');
    if (canvas) {
        initRenderer(canvas);
        initInput(canvas, canvas.width);
    }
});

window.startLocalGame = () => {
    showScreen('game-screen');
    render();
};