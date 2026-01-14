// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';
import { initRenderer, render, updateInventoryUI } from './game/renderer.js';
import { initInput } from './game/input.js';
import { selectInventoryPiece, turn, resetGameState, setGameOver, gameMode } from './game/state.js';
import {
    createRoom,
    joinRoom,
    currentRoom,
    subscribeToRoomStatus,
    closeRoom,
    deleteRoomAndActions,
    myColor,
    swapColors,
    resetOnlineState
} from './online/rooms.js';
import { subscribeToActions, sendAction } from './online/actions.js';

window.showScreen = showScreen;
window.showToast = showToast;
window.updateInventoryUI = updateInventoryUI;
let lastGameResult = null;

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
            updatePlayerIdentity();
            updateInventoryVisibility();
            updateInventoryUI();
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
        updatePlayerIdentity();
        updateInventoryVisibility();
        updateInventoryUI();
    } catch (err) {
        showToast('Room not found');
    }
};

window.leaveOnlineGame = async () => {
    await closeRoom();
    resetGameState();
    resetOnlineState();
    showScreen('menu-screen');
    document.getElementById('game-screen').classList.remove('animating');

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
    const indicator = document.getElementById('turn-indicator');

    if (!el) return;

    if (!myColor) {
        el.innerText = `${turn.toUpperCase()}'S TURN`;
        el.className = `turn-display ${turn}-turn`;
        indicator.style.display = 'none';
        return;
    }

    if (turn === myColor) {
        el.innerText = 'YOUR TURN';
        el.className = 'turn-display your-turn';
        indicator.style.display = 'block';
        indicator.className = 'turn-indicator my-turn-indicator';
        indicator.textContent = '✓ Your turn';
    } else {
        el.innerText = "OPPONENT'S TURN";
        el.className = 'turn-display';
        indicator.style.display = 'block';
        indicator.className = 'turn-indicator wait-indicator';
        indicator.textContent = '⏳ Waiting for opponent';
    }
}
window.updateTurnUI = updateTurnUI;

window.startLocalGame = () => {
    resetGameState();
    hideWinScreen();
    lastGameResult = null;
    showScreen('game-screen');
    updateTurnUI();
    updatePlayerIdentity();
    updateInventoryVisibility();
    updateInventoryUI();
    render();
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
    updateTurnUI();
    swapColors();
    updatePlayerIdentity();
    updateInventoryVisibility();
    document.getElementById('game-screen').classList.remove('animating');
    updateInventoryUI();
    render();
}
window.addEventListener('rematch-accepted', startRematch);

function updatePlayerIdentity() {
    const el = document.getElementById('player-identity');

    if (gameMode === 'local') {
        el.innerText = 'LOCAL MODE';
        return;
    }

    el.innerText = `YOU ARE ${myColor.toUpperCase()}`;
}

function updateInventoryVisibility() {
    const whiteInv = document.getElementById('white-inv');
    const blackInv = document.getElementById('black-inv');

    if (gameMode === 'local') {
        whiteInv.style.display = 'grid';
        blackInv.style.display = 'grid';
        return;
    }

    whiteInv.style.display = myColor === 'white' ? 'grid' : 'none';
    blackInv.style.display = myColor === 'black' ? 'grid' : 'none';
}
