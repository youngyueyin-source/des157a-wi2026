(function () {
    'use strict';

    const openOverlayBtn = document.querySelector('#open-overlay');
    const closeOverlayBtn = document.querySelector('#close-overlay');
    const overlay = document.querySelector('#start-overlay');
    const playerForm = document.querySelector('#player-form');
    const playerNameInput = document.querySelector('#player-name');

    openOverlayBtn.addEventListener('click', function () {
        overlay.classList.remove('hidden');
    });

    closeOverlayBtn.addEventListener('click', function () {
        overlay.classList.add('hidden');
    });

    playerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const playerName = playerNameInput.value.trim() || 'Player One';

        sessionStorage.setItem('playerOneName', playerName);
        window.location.href = 'game.html';
    });
})();