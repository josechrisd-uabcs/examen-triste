import { load_assets } from "./asset_loader.js";
import { Game } from "./engine.js";
import { HomeScreen } from "./game.js";
import { LoadingScreen } from "./loading_screen.js";

window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'))
    game.doLoop();
    game.addEntity(new LoadingScreen());
})