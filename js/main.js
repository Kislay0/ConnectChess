
// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render } from './game/renderer.js';
import { initInput } from './game/input.js';
import { selectInventoryPiece } from './game/state.js';

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

document.querySelectorAll('.inv-item').forEach(item => {
    item.addEventListener('click', () => {
        const piece = item.dataset.type;
        selectInventoryPiece(piece);
    });
});

window.startLocalGame = () => {
    showScreen('game-screen');
    render();
};