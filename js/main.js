window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'))
    game.doLoop();
})