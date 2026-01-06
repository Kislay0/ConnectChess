// js/game/actions.js
import {
    board,
    inventories,
    placementComplete,
    switchTurn,
    setGameOver
} from './state.js';
import { checkWin } from './rules.js';
import { render } from './renderer.js';

export function applyAction(action) {
    if (action.type === 'place') {
        applyPlacement(action);
    }

    if (action.type === 'move') {
        applyMove(action);
    }

    if (checkWin(action.player)) {
    setGameOver();
    return { gameOver: true, winner: action.player };
    }
    
    switchTurn();
    return { gameOver: false };
}

function applyPlacement({ player, piece, to }) {
    board[to.r][to.c] = {
        type: piece,
        color: player,
        dir: player === 'white' ? -1 : 1
    };

    const idx = inventories[player].indexOf(piece);
    inventories[player].splice(idx, 1);

    placementComplete[player] ||= countPieces(player) >= 3;
}

function applyMove({ player, from, to }) {
    const target = board[to.r][to.c];
    if (target) inventories[target.color].push(target.type);

    board[to.r][to.c] = board[from.r][from.c];
    board[from.r][from.c] = null;

    const moved = board[to.r][to.c];
    if (moved.type === 'P') {
        if (to.r === 0) moved.dir = 1;
        if (to.r === 3) moved.dir = -1;
    }
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
