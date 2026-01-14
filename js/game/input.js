// js/game/input.js
import {
    gameMode,
    board,
    turn,
    inventories,
    placementComplete,
    switchTurn,
    selectedInventoryPiece,
    clearSelectedInventory,
    gameOver,
    setGameOver
} from './state.js';
import { getValidMoves } from './rules.js';
import { render, setValidMoves } from './renderer.js';
import { showToast } from '../ui/toast.js';
import { applyAction } from './actions.js';
import { sendAction } from '../online/actions.js';
import { currentRoom, myColor } from '../online/rooms.js';

let selectedPiece = null;
let selectedFrom = null;
let canvas, cellSize;
let currentUserColor = gameMode === 'online' ? myColor : turn;

export function initInput(canvasEl, size) {
    canvas = canvasEl;
    cellSize = size / 4;

    canvas.addEventListener('mousedown', handleClick);
}

function handleClick(e) {
    if (gameOver) {
        showToast("Game over");
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / cellSize);
    const r = Math.floor((e.clientY - rect.top) / cellSize);

    if (r < 0 || r > 3 || c < 0 || c > 3) return;

    // Placement commit (turn-restricted)
    if (selectedInventoryPiece && currentUserColor === turn) {
        placePiece(r, c);
        return;
    }

    // Selecting a piece (ALWAYS allowed)
    if (!selectedFrom && board[r][c]?.color === currentUserColor) {
        selectedFrom = { r, c };
        selectedPiece = board[r][c];
        setValidMoves(getValidMoves(r, c));
        render();
        return;
    }

    // Move commit (turn-restricted)
    if (selectedFrom && currentUserColor === turn) movePiece(r, c);
}


function placePiece(r, c) {
    if (gameMode === 'online' && !inventories[turn].includes(selectedInventoryPiece)) {
        showToast("You don't have that piece");
        clearSelectedInventory();
        return;
    }

    if (board[r][c]) {
        showToast("Cell already occupied");
        return;
    }

    const action = {
        type: 'place',
        player: currentUserColor,
        piece: selectedInventoryPiece,
        to: { r, c }
    };

    clearSelectedInventory();
    setValidMoves([]);
    if (gameMode === 'online') {
        sendAction(currentRoom.id, action);
        // const result = applyAction(action);
        // postApply(result);
    } else {
        const result = applyAction(action);
        postApply(result);
    }
}


function movePiece(r, c) {
    const validMoves = getValidMoves(selectedFrom.r, selectedFrom.c);
    const valid = validMoves.find(m => m.r === r && m.c === c);

    if (!valid) {
        selectedFrom = null;
        selectedPiece = null;
        setValidMoves([]);
        render();
        return;
    } turn

    const action = {
        type: 'move',
        player: currentUserColor,
        from: { ...selectedFrom },
        to: { r, c }
    };

    selectedFrom = null;
    selectedPiece = null;
    setValidMoves([]);

    if (gameMode === 'online') {
        sendAction(currentRoom.id, action);
        // const result = applyAction(action);
        // postApply(result);
    } else {
        const result = applyAction(action);
        postApply(result);
    }
}

function postApply(result) {
    render();
    window.updateTurnUI();
    window.updateInventoryUI(); 

    window.handleGameOver(result);
}
