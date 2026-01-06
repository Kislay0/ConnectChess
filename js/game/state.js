// js/game/state.js

export const BOARD_SIZE = 4;

export let board = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
);

export let turn = 'white';
export let gameOver = false;

export let inventories = {
    white: ['P', 'R', 'N', 'B'],
    black: ['P', 'R', 'N', 'B']
};

export let placementComplete = {
    white: false,
    black: false
};

export function resetGame() {
    board = Array.from({ length: BOARD_SIZE }, () =>
        Array(BOARD_SIZE).fill(null)
    );

    turn = 'white';

    inventories = {
        white: ['P', 'R', 'N', 'B'],
        black: ['P', 'R', 'N', 'B']
    };

    placementComplete = {
        white: false,
        black: false
    };
}
export function switchTurn() {
    turn = turn === 'white' ? 'black' : 'white';
}
export let selectedInventoryPiece = null;

export function selectInventoryPiece(piece) {
    selectedInventoryPiece = piece;
}

export function clearSelectedInventory() {
    selectedInventoryPiece = null;
}

export function setGameOver() {
    gameOver = true;
}
