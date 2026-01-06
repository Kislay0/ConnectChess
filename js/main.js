
// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render, updateInventoryUI } from './game/renderer.js';
import { initInput } from './game/input.js';
import { selectInventoryPiece, turn } from './game/state.js';
import { createRoom, joinRoom } from './online/rooms.js';

window.showScreen = showScreen;
window.showToast = showToast;

window.createOnlineRoom = async () => {
    try {
        const room = await createRoom();
        console.log('Room created:', room);
        alert(`Room code: ${room.code}`);
    } catch (e) {
        alert(e.message);
    }
};

window.joinOnlineRoom = async (code) => {
    try {
        const room = await joinRoom(code);
        console.log('Joined room:', room);
        alert(`Joined room ${room.code}`);
    } catch (e) {
        alert('Room not found');
    }
};

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
        window.__selectedInventory = piece; // temporary UI bridge
        selectInventoryPiece(piece);
        updateInventoryUI();
    });
});

function updateTurnUI() {
    const el = document.getElementById('turn-txt');
    if (!el) return;

    el.innerText = `${turn.toUpperCase()}'S TURN`;
    el.className = `turn-display ${turn}-turn`;
}
window.updateTurnUI = updateTurnUI;

document.querySelectorAll('.inv-item').forEach(item => {
    item.addEventListener('click', () => {
        const piece = item.dataset.type;
        selectInventoryPiece(piece);
    });
});

window.startLocalGame = () => {
    showScreen('game-screen');
    render();
    updateTurnUI();
};