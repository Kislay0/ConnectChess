// js/ui/toast.js

let toastTimeout = null;

export function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element not found');
        return;
    }

    toast.innerText = message;
    toast.style.transform = 'translateY(0)';

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
    }, duration);
}
