// js/game/renderer.js
import { board, BOARD_SIZE, inventories, selectedInventoryPiece } from './state.js';
import { myColor } from '../online/rooms.js';

const PIECES = {
    white: { P:'♙', R:'♖', N:'♘', B:'♗' },
    black: { P:'♟', R:'♜', N:'♞', B:'♝' }
};

let canvas, ctx, cellSize;
let validMoves = [];

export function setValidMoves(moves) {
    validMoves = moves;
}

export function initRenderer(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');

    const size = Math.min(window.innerWidth * 0.8, 400);
    canvas.width = canvas.height = size;
    cellSize = size / BOARD_SIZE;

    render();
}

export function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#5e4533' : '#3d2b1f';
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);

            const piece = board[r][c];
            if (piece) {
                ctx.font = `${cellSize * 0.7}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = piece.color === 'white' ? '#fff' : '#111';
                ctx.fillText(
                    PIECES[piece.color][piece.type],
                    c * cellSize + cellSize / 2,
                    r * cellSize + cellSize / 2
                );
            }
        }
    }
    validMoves.forEach(move => {
        ctx.beginPath();
        ctx.arc(
            move.c * cellSize + cellSize / 2,
            move.r * cellSize + cellSize / 2,
            cellSize * 0.15,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fill();
    });
}
export function updateInventoryUI() {
    document.querySelectorAll('.inv-item').forEach(item => {
        const piece = item.dataset.type;
        const player = item.dataset.player;

        if (myColor && player !== myColor) {
            item.style.display = 'none';
            return;
        } else {
            item.style.display = '';
        }

        const hasPiece = inventories[player]?.includes(piece);
        item.classList.toggle('disabled', !hasPiece);

        item.classList.toggle(
            'selected',
            hasPiece && piece === selectedInventoryPiece
        );
    });
}
