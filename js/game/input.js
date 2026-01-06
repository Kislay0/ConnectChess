// js/game/input.js
import {
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
import { getValidMoves, checkPlacementComplete, checkWin } from './rules.js';
import { render, setValidMoves } from './renderer.js';
import { showToast } from '../ui/toast.js';
import { applyAction } from './actions.js';

let selectedPiece = null;
let selectedFrom = null;
let canvas, cellSize;

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

    // Placement phase
    if (selectedInventoryPiece) {
        placePiece(r, c);
        return;
    }

    // Selecting a piece
    if (!selectedFrom && board[r][c]?.color === turn) {
        selectedFrom = { r, c };
        selectedPiece = board[r][c];
        setValidMoves(getValidMoves(r, c));
        render();
        return;
    }

    // Moving a piece
    if (selectedFrom) {
        movePiece(r, c);
    }
}

function placePiece(r, c) {
    if (!inventories[turn].includes(selectedInventoryPiece)) {
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
        player: turn,
        piece: selectedInventoryPiece,
        to: { r, c }
    };

    clearSelectedInventory();
    setValidMoves([]);
    const result = applyAction(action);

    render();
    window.updateTurnUI();
    
    if (result?.gameOver) {
        showToast(`${result.winner.toUpperCase()} WINS!`);
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
    }

    const action = {
        type: 'move',
        player: turn,
        from: { ...selectedFrom },
        to: { r, c }
    };

    selectedFrom = null;
    selectedPiece = null;
    setValidMoves([]);

    const result = applyAction(action);

    render();
    window.updateTurnUI();
    
    if (result?.gameOver) {
        showToast(`${result.winner.toUpperCase()} WINS!`);
    }
}
