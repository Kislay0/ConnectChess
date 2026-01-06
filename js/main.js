// js/main.js

import { showScreen } from './ui/screens.js';
import { showToast } from './ui/toast.js';

// Expose functions to HTML (temporary, will improve later)
window.showScreen = showScreen;
window.showToast = showToast;

console.log('ChessConnect UI loaded');

// Initial screen
document.addEventListener('DOMContentLoaded', () => {
    showScreen('menu-screen');
});
