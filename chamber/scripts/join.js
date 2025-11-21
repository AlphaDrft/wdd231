document.addEventListener('DOMContentLoaded', () => {
    
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const membershipCards = document.querySelectorAll('.membership-card');
    if (membershipCards.length > 0) {
        membershipCards.forEach(card => {
            card.addEventListener('click', () => {
                membershipCards.forEach(c => c.classList.remove('selected-card'));
                card.classList.add('selected-card');
            });
        });
    }

    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('is-visible');
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('is-visible');
        });
    });

    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.classList.remove('is-visible');
            }
        });
    });
});