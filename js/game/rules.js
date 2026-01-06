// js/game/rules.js
import { board, BOARD_SIZE } from './state.js';

export function countPieces(player) {
    let count = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c]?.color === player) count++;
        }
    }
    return count;
}

export function checkWin(player) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        if (board[i].every(cell => cell?.color === player)) return true;
        if (board.every(row => row[i]?.color === player)) return true;
    }

    if ([0,1,2,3].every(i => board[i][i]?.color === player)) return true;
    if ([0,1,2,3].every(i => board[i][3 - i]?.color === player)) return true;

    return false;
}
