import { Game } from "./engine.js";
import { HomeScreen } from "./game.js";

window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'))
    game.doLoop();
    game.addEntity(new HomeScreen());
})