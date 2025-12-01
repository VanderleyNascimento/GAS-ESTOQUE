const Modal = {
    confirm(title, message, confirmText = 'Confirmar') {
        return new Promise((resolve) => {
            const modal = document.getElementById('modal-confirm');
            if (!modal) {
                console.error('Modal element not found!');
                resolve(confirm(message)); // Fallback
                return;
            }

            const titleEl = document.getElementById('confirm-title');
            const messageEl = document.getElementById('confirm-message');
            const btnYes = document.getElementById('btn-confirm-yes');
            const btnNo = document.getElementById('btn-confirm-cancel');

            if (!titleEl || !messageEl || !btnYes || !btnNo) {
                console.error('Modal elements missing!');
                resolve(confirm(message));
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;
            btnYes.textContent = confirmText;

            // Clone buttons to remove old event listeners
            const newBtnYes = btnYes.cloneNode(true);
            const newBtnNo = btnNo.cloneNode(true);

            btnYes.parentNode.replaceChild(newBtnYes, btnYes);
            btnNo.parentNode.replaceChild(newBtnNo, btnNo);

            const close = (result) => {
                modal.classList.add('hidden');
                resolve(result);
            };

            newBtnYes.addEventListener('click', () => close(true));
            newBtnNo.addEventListener('click', () => close(false));

            modal.classList.remove('hidden');
        });
    }
};

window.Modal = Modal;
