
// js/game/rules.js
import { board, BOARD_SIZE, placementComplete } from './state.js';

export function checkPlacementComplete(player) {
    let count = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c]?.color === player) count++;
        }
    }
    if (count >= 3) placementComplete[player] = true;
}

export function getValidMoves(r, c) {
    const piece = board[r][c];
    if (!piece) return [];

    const moves = [];
    const add = (nr, nc) => {
        if (nr < 0 || nr >= 4 || nc < 0 || nc >= 4) return false;
        const target = board[nr][nc];
        if (!target) {
            moves.push({ r: nr, c: nc });
            return true;
        }
        if (target.color !== piece.color) {
            moves.push({ r: nr, c: nc });
        }
        return false;
    };

    if (piece.type === 'R') {
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{
            for(let i=1;i<4;i++) if(!add(r+dr*i,c+dc*i)) break;
        });
    }

    if (piece.type === 'B') {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>{
            for(let i=1;i<4;i++) if(!add(r+dr*i,c+dc*i)) break;
        });
    }

    if (piece.type === 'N') {
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
            .forEach(([dr,dc])=>add(r+dr,c+dc));
    }

    if (piece.type === 'P') {
        const nr = r + piece.dir;
        if (nr >= 0 && nr < 4 && !board[nr][c]) {
            moves.push({ r: nr, c });
        }
        [-1, 1].forEach(dc => {
        const nc = c + dc;
            if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const target = board[nr][nc];
                if (target && target.color !== piece.color) {
                    moves.push({ r: nr, c: nc });
                }
            }
        });
    }

    return moves;
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
