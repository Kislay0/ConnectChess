// js/game/input.js
import {
    board,
    turn,
    inventories,
    placementComplete,
    switchTurn,
    selectedInventoryPiece,
    clearSelectedInventory
} from './state.js';
import { getValidMoves, checkPlacementComplete, checkWin } from './rules.js';
import { render } from './renderer.js';
import { showToast } from '../ui/toast.js';

let selectedPiece = null;
let selectedFrom = null;
let canvas, cellSize;

export function initInput(canvasEl, size) {
    canvas = canvasEl;
    cellSize = size / 4;

    canvas.addEventListener('mousedown', handleClick);
}

function handleClick(e) {
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
        render();
        return;
    }

    // Moving a piece
    if (selectedFrom) {
        movePiece(r, c);
    }
}

function placePiece(r, c) {
    if (board[r][c]) {
        showToast('Cell already occupied');
        return;
    }

    board[r][c] = {
        type: selectedInventoryPiece,
        color: turn,
        dir: turn === 'white' ? -1 : 1
    };

    const idx = inventories[turn].indexOf(selectedInventoryPiece);
    inventories[turn].splice(idx, 1);

    clearSelectedInventory();
    checkPlacementComplete(turn);
    endTurn();
}

function movePiece(r, c) {
    const validMoves = getValidMoves(selectedFrom.r, selectedFrom.c);
    const valid = validMoves.find(m => m.r === r && m.c === c);

    if (!valid) {
        selectedFrom = null;
        selectedPiece = null;
        render();
        return;
    }

    const target = board[r][c];
    if (target) {
        inventories[target.color].push(target.type);
    }

    board[r][c] = selectedPiece;
    board[selectedFrom.r][selectedFrom.c] = null;

    selectedFrom = null;
    selectedPiece = null;
    endTurn();
}

function endTurn() {
    if (checkWin(turn)) {
        showToast(`${turn.toUpperCase()} WINS!`);
        return;
    }

    switchTurn();
    render();
}
