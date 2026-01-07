// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render, updateInventoryUI } from './game/renderer.js';
import { initInput } from './game/input.js';
import { selectInventoryPiece, turn, resetGameState, setGameOver } from './game/state.js';
import { createRoom, joinRoom, currentRoom, subscribeToRoomStatus, closeRoom, deleteRoomAndActions, myColor, swapColors } from './online/rooms.js';
import { subscribeToActions, sendAction } from './online/actions.js';

window.showScreen = showScreen;
window.showToast = showToast;
let lastGameResult = null;

// TEMP DEV HELPERS

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

window.leaveOnlineGame = async () => {
    await closeRoom();        // 🔔 notify opponent (realtime-safe)
    resetGameState();         // 🧹 clear local JS state
    showScreen('menu-screen');

    setTimeout(() => {
        deleteRoomAndActions();
    }, 1000);
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
    hideWinScreen();
    lastGameResult = null;
    showScreen('game-screen');
    render();
    updateTurnUI();
};

window.leaveOnlineGame = async () => {
    await closeRoom();          // notify opponent
    resetGameState();           // clear local state
    showScreen('menu-screen');
};

window.addEventListener('room-closed', () => {
    showToast("Opponent left the game");
    resetGameState();
    showScreen('menu-screen');
});

window.handleGameOver = (result) => {
    if (!result || !result.gameOver) return;
    if (lastGameResult) return;

    lastGameResult = result;

    setGameOver(true);

    showWinScreen(result.winner);
    document.getElementById('game-screen').classList.add('animating');
};


function showWinScreen(winner) {
    const winScreen = document.getElementById('win-screen');
    const winnerText = document.getElementById('winner-text');
    const rematchSection = document.getElementById('rematch-section');

    winnerText.innerText = `${winner.toUpperCase()} WINS!`;

    winScreen.classList.remove('hidden');
    if (currentRoom) {
        rematchSection.style.display = 'block';
    }
    else {
        rematchSection.style.display = 'none';
    }
}

function hideWinScreen() {
    const winScreen = document.getElementById('win-screen');
    const rematchSection = document.getElementById('rematch-section');

    winScreen.classList.add('hidden');
    rematchSection.style.display = 'none';
}

window.closeWinScreen = () => {
    hideWinScreen();
};

window.leaveGame = () => {
    hideWinScreen();
    leaveOnlineGame(); // already implemented
};

window.handleRematchClick = () => {
    if (!currentRoom) return;

    sendAction(currentRoom.id, {
        type: 'rematch-request',
        player: myColor
    });

    document.getElementById('rematch-status').style.display = 'block';
    document.getElementById('rematch-status').innerText = 'Waiting for opponent...';
};

window.acceptRematch = () => {
    document.getElementById('rematch-popup').classList.add('hidden');

    sendAction(currentRoom.id, {
        type: 'rematch-accept',
        player: myColor
    });
};

window.rejectRematch = () => {
    document.getElementById('rematch-popup').classList.add('hidden');

    sendAction(currentRoom.id, {
        type: 'rematch-reject',
        player: myColor
    });
};

function startRematch() {
    hideWinScreen();
    lastGameResult = null;
    resetGameState();
    render();
    updateTurnUI();
    swapColors();
}
window.addEventListener('rematch-accepted', startRematch);
