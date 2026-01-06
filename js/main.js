// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render, updateInventoryUI } from './game/renderer.js';
import { initInput } from './game/input.js';
import { selectInventoryPiece, turn } from './game/state.js';
import { createRoom, joinRoom, currentRoom, subscribeToRoomStatus, cancelRoom } from './online/rooms.js';
import { subscribeToActions } from './online/actions.js';

window.showScreen = showScreen;
window.showToast = showToast;

// 🔧 TEMP DEV HELPERS (Phase 6.4 testing)

// window.__createRoom = async () => {
//     const room = await createRoom();
//     console.log('ROOM CREATED:', room);
//     alert(`ROOM CODE: ${room.code}`);

//     subscribeToActions(room.id);

//     showScreen('game-screen');
//     render();
//     updateTurnUI();
// };

// window.__joinRoom = async (code) => {
//     const room = await joinRoom(code);
//     console.log('ROOM JOINED:', room);

//     subscribeToActions(room.id);

//     showScreen('game-screen');
//     render();
//     updateTurnUI();
// };

window.createOnlineRoom = async () => {
    try {
        const room = await createRoom();

        // Show room code UI
        document.getElementById('room-code').innerText = room.code;
        showScreen('host-screen');

        subscribeToRoomStatus(room.id, () => {
            showScreen('game-screen');
            subscribeToActions(room.id);
            render();
            updateTurnUI();
        });
    } catch (err) {
        showToast(err.message || 'Failed to create room');
    }
};

window.joinOnlineRoom = async () => {
    const input = document.getElementById('join-code-input');
    const code = input.value.trim().toUpperCase();

    if (code.length !== 6) {
        showToast('Invalid room code');
        return;
    }

    try {
        const room = await joinRoom(code);

        showScreen('game-screen');
        subscribeToActions(room.id);

        render();
        updateTurnUI();
    } catch (err) {
        showToast('Room not found');
    }
};

window.cancelOnlineRoom = async () => {
    await cancelRoom();
    showScreen('menu-screen');
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


window.startLocalGame = () => {
    showScreen('game-screen');
    render();
    updateTurnUI();
};