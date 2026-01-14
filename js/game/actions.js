// js/game/actions.js
import {
    board,
    inventories,
    placementComplete,
    switchTurn,
    setGameOver,
    turn,
    gameMode,
    gameOver,
} from './state.js';
import { checkWin } from './rules.js';
import { showToast } from '../ui/toast.js';

export function applyAction(action) {
    if (gameOver) return;
    if (action.player !== turn) {
        showToast("Not your turn");
        return;
    }
    if (action.type === 'place') {
        applyPlacement(action);
    }

    if (action.type === 'move') {
        applyMove(action);
    }

    if (checkWin(action.player)) {
    setGameOver();
    window.handleGameOver(action.player);
    return { gameOver: true, winner: action.player };
    }
    
    return { gameOver: false };
}

function applyPlacement({ player, piece, to }) {
    if (!inventories[player].includes(piece)) {
        showToast("Piece not in inventory");
        return;
    }
    board[to.r][to.c] = {
        type: piece,
        color: player,
        dir: player === 'white' ? -1 : 1
    };

    const idx = inventories[player].indexOf(piece);
    if (idx === -1) return;
    inventories[player].splice(idx, 1);

    placementComplete[player] ||= countPieces(player) >= 3;
    switchTurn();
}

function applyMove({ player, from, to }) {
    if (from.r < 0 || from.r >= 4 || from.c < 0 || from.c >= 4 ||
        to.r < 0 || to.r >= 4 || to.c < 0 || to.c >= 4) {
        showToast("Invalid move: out of bounds");
        return;
    }
    const target = board[to.r][to.c];
    if (target) inventories[target.color].push(target.type);
    const piece = board[from.r][from.c];
    if (!piece || piece.color !== player) {
        showToast("Invalid move: no piece at source");
        return;
    }

    board[to.r][to.c] = board[from.r][from.c];
    board[from.r][from.c] = null;

    const moved = board[to.r][to.c];
    if (moved.type === 'P') {
        if (to.r === 0) moved.dir = 1;
        if (to.r === 3) moved.dir = -1;
    }
    switchTurn();
}

function countPieces(player) {
    let count = 0;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c]?.color === player) count++;
        }
    }
    return count;
}
