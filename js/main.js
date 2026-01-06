
// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render } from './game/renderer.js';
import { board, turn } from './game/state.js';

window.showScreen = showScreen;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
    showScreen('menu-screen');

    const canvas = document.getElementById('boardCanvas');
    if (canvas) {
        initRenderer(canvas);
    }
});

window.startLocalGame = () => {
    showScreen('game-screen');
    render();
};