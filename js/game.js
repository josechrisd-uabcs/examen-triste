import { assets, get_sounds, load_assets } from "./asset_loader.js";
import { Entity } from "./engine.js";
import { deepCopy, max, rotationalClamp } from "./utils.js";

const figurines = [
    {
        figurePoints: [
            ['*','*', '*'],
            ['*',' ', ' '],
        ],
        image: assets.l_image,
        sounds: get_sounds('bamboo'),
    },
    {
        figurePoints: [
            ['*','*','*'],
            [' ',' ','*'],
        ],
        image: assets.j_image,
        sounds: get_sounds('stone'),
    },
    {
        figurePoints: [
            [' ','*','*'],
            ['*','*',' '],
        ],
        image: assets.s_image,
        sounds: get_sounds('grass'),
    },
    {
        figurePoints: [            
            ['*','*',' '],
            [' ','*','*'],
        ],
        image: assets.z_image,
        sounds: get_sounds('copper'),
    },
    {
        figurePoints: [
            ['*','*'],
            ['*','*'],
        ],
        image: assets.o_image,
        sounds: get_sounds('sand'),
    },
    {
        figurePoints: [
            ['*','*','*','*'],
        ],
        image: assets.i_image,
        sounds: get_sounds('gravel'),
    },
    {
        figurePoints: [
            ['*','*','*'],
            [' ','*',' ']
        ],
        image: assets.t_image,
        sounds: get_sounds('wood'),
    }
]


class Figurine extends Entity {
    constructor(cell_size, board_pos, pos, padding, figureData = {
        figurePoints: [
            ['*',' '],
            ['*',' '],
            ['*','*'],
        ],
    }, image, sounds) {
        super(1);
        this.board_pos = board_pos;
        this.pos = pos;
        this.cell_size = cell_size;
        this.padding = padding;
        this.figureData = figureData;
        this.image = image;
        this.rotation = 0;
        this.sounds = sounds;
    }

    draw(ctx, size, game){
        ctx.fillStyle = this.image.color;
        for (let i = 0, y = this.board_pos[1] + this.padding + (this.cell_size[0] + this.padding) * this.pos[1]; i < this.figureData.figurePoints.length; i++, y += this.cell_size[1] + this.padding) {
            for (let j = 0, x = this.board_pos[0] + this.padding + (this.cell_size[1] + this.padding) * this.pos[0]; j < this.figureData.figurePoints[i].length; j++, x += this.cell_size[0] + this.padding) {
                if(this.figureData.figurePoints[i][j] !== ' '){
                    ctx.fillRect(x, y, ...this.cell_size);
                    this.image.asset && ctx.drawImage(this.image.asset, x, y, ...this.cell_size);
                }
            }
        }
    }

    get points () {
        const arr = [];
        for (let i = 0; i < this.figureData.figurePoints.length; i++) {
            for (let j = 0; j < this.figureData.figurePoints[i].length; j++) {
                if(this.figureData.figurePoints[i][j] !== ' '){
                    arr.push([this.pos[0] + j, this.pos[1] + i])
                }
            }
        }
        return arr;
    }

    get size() {
        return [max(this.figureData.figurePoints.map(e => e.length)), this.figureData.figurePoints.length];
    }
    
    collides_with(point = [0, 0]){
        return point[1] - this.pos[1] >= 0 &&
        point[1] - this.pos[1] < this.figureData.figurePoints.length && 
        point[0] - this.pos[0] >= 0 && 
        point[0] - this.pos[0] < this.figureData.figurePoints[point[1] - this.pos[1]].length &&
        this.figureData.figurePoints[point[1] - this.pos[1]][point[0] - this.pos[0]]  !== ' ';
    }

    rotate(direction = 1){
        const new_rotation = rotationalClamp(this.rotation + direction, 0, 4);
        const figure_data = this.figureData;
        let new_figure_points;
        if((this.rotation & 0b1) !== (new_rotation & 0b1)){
            new_figure_points = Array(figure_data.figurePoints[0].length).fill(0).map(e => Array(figure_data.figurePoints.length).fill(' '));
            for (let i = 0; i < new_figure_points.length; i++) {
                for (let j = 0; j < new_figure_points[i].length; j++) {
                    new_figure_points[i][new_figure_points[i].length - 1 -j] = figure_data.figurePoints[j][i];
                }
            }
        }
        return new_figure_points;
    }

    rotateFigure() {
        this.figureData.figurePoints = this.rotate(1);
    }

    play_sound(){
        let sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
        let i = 0;
        while(!sound.asset){
            let sound = this.sounds[Math.random() * this.sounds.length];
            if(i++ > 10) return;
        }
        sound.asset.currentTime = (0);
        sound.asset.play();
    }
}

class NextFigurine extends Entity {

    constructor(cell_size, pos, padding, figureData = {
        figurePoints: [
            ['*',' '],
            ['*',' '],
            ['*','*'],
        ],
    }, image) {
        super(1);
        this.size = [ figureData.figurePoints[0].length, figureData.figurePoints.length ];
        this.pos = pos;
        this.cell_size = cell_size;
        this.padding = padding;
        this.figureData = figureData;
        this.image = image;
        this.rotation = 0;
    }

    draw(ctx, size, game){
        ctx.fillStyle = this.image.color;
        const real_size = this.size.map((e, i) => this.cell_size[i] * e + this.padding * (e + 1));
        const pos = [this.pos[0] - real_size[0] / 2, this.pos[1] - real_size[1] / 2]
        for (let i = 0, y = pos[1] + this.padding; i < this.figureData.figurePoints.length; i++, y += this.cell_size[1] + this.padding) {
            for (let j = 0, x = pos[0] + this.padding; j < this.figureData.figurePoints[i].length; j++, x += this.cell_size[0] + this.padding) {
                if(this.figureData.figurePoints[i][j] !== ' '){
                    ctx.fillRect(x, y, ...this.cell_size);
                    this.image.asset && ctx.drawImage(this.image.asset, x, y, ...this.cell_size);
                }
            }
        }
    }
}
        
class Point extends Entity {
    constructor(cell_size, board_pos, pos, padding, image = '#fff') {
        super(1);
        this.board_pos = board_pos;
        this.pos = pos;
        this.cell_size = cell_size;
        this.padding = padding;
        this.image = image;
        this.rotation = 0;
    }

    draw(ctx, size, game){
        ctx.fillStyle = this.image.color;
        ctx.fillRect(
            this.board_pos[0] + this.padding + (this.cell_size[1] + this.padding) * this.pos[0], 
            this.board_pos[1] + this.padding + (this.cell_size[0] + this.padding) * this.pos[1], 
            ...this.cell_size
        );
        
        this.image.asset && ctx.drawImage(
            this.image.asset,
            this.board_pos[0] + this.padding + (this.cell_size[1] + this.padding) * this.pos[0], 
            this.board_pos[1] + this.padding + (this.cell_size[0] + this.padding) * this.pos[1], 
            ...this.cell_size
        );
    }
    
    collides_with(point = [0, 0]){
        return this.pos[0] == point[0] && this.pos[1] == point[1];
    }
}

export class MenuScreen extends Entity {
    constructor(){
        super();
        this.selected_option = 0;
        this.options = [];
        this.background = '#000';
        this.foreground = '#ddd';
        this.selectedForeground = '#fff';
        this.fontSize = 16;
        this.fontFamily = 'sans-serif';
        this.lineSpacing = 1.2;
        this.menuX = .5;
        this.menuY = 300;
    }

    get font() {
        return `${this.fontSize}px ${this.fontFamily}`
    }

    draw(ctx, size, game){
        this.options.forEach((e, i) => {
            ctx.font = this.font;
            ctx.fillStyle = i == this.selected_option ? this.selectedForeground : this.foreground;
            ctx.textAlign = 'center';
            const label = i == this.selected_option ? `> ${e.label} <` : e.label;
            ctx.fillText(label, size[0] * (this.menuX % 1) + (this.menuX - this.menuX % 1), size[1] * (this.menuY % 1) + (this.menuY - this.menuY % 1) + this.lineSpacing * this.fontSize * (i + 1))
        })
    }
    
    keydown(keycode, key, event, game) {
        if(key == 'ArrowDown' && this.selected_option < this.options.length - 1){
            this.selected_option++;
        }
        if(key == 'ArrowUp' && this.selected_option) {
            this.selected_option--;
        }
        if(key == 'Enter') {
            this.options[this.selected_option].onSelect(game)
        }
    }
}

export class HomeScreen extends MenuScreen {
    constructor(){
        super();
        this.options = [
            {
                label: 'Jugar',
                onSelect: (game) => {
                    game.removeEntity(this);
                    game.addEntity(new InGameScreen());
                    game.addEntity(new GameOverPanel());
                }
            },
            {
                label: 'Controles',
                onSelect: (game) => {
                    game.removeEntity(this);
                    game.addEntity(new ControlsScreen());
                }
            },
        ]
    }

    init(game){
        game.getEntitiesOfType(MusicController.name).length == 0 && game.addEntity(new MusicController());
    }
}


class InGameScreen extends Entity {
    constructor() {
        super();
        this.background = '#222'
        this.board = Object.freeze({
            pos: [ 10, 10 ],
            cell_size: [ 24, 24 ],
            size: [ 10, 20 ],
            padding: 2
        });
        this.figurine = null;
        this.next_figurine = null;
        this.clock = 0;
        this.sped_up = false;
        this.point_map = [];
        this.time_elapsed = 0;
        this.speed_boost_timer = 0;
        this.line_sounds = get_sounds('line');
    }
    
    play_line_sound(){
        let sound = this.line_sounds[Math.floor(Math.random() * this.line_sounds.length)];
        let i = 0;
        while(!sound.asset){
            let sound = this.line_sounds[Math.random() * this.line_sounds.length];
            if(i++ > 10) return;
        }
        sound.asset.currentTime = (0);
        sound.asset.play();
    }

    init(game) {
        game.setContext({
            speed: .5,
            next_figurine: figurines[Math.floor(Math.random() * figurines.length)],
            speed_boost: 180
        })
        this.generate_figurine(game);
    }

    cleanup(game){
        this.figurine = null;
        this.next_figurine = null;
        this.clock = 0;
        this.sped_up = false;
        this.point_map = [];
        this.time_elapsed = 0;
        this.speed_boost_timer = 0;
    }
    
    generate_figurine(game) {
        this.next_figurine && game.removeEntity(this.next_figurine);
        this.figurine = game.addEntity(new Figurine(this.board.cell_size, this.board.pos, [1, 0], this.board.padding, deepCopy(game.context.next_figurine), game.context.next_figurine.image, game.context.next_figurine.sounds))
        this.figurine.pos[0] = Math.floor((this.board.size[0] - this.figurine.size[0]) / 2)
        this.figurine.pos[1] = 1 - this.figurine.size[1];
        game.setContext({
            next_figurine: figurines[Math.floor(Math.random() * figurines.length)],
        })
        this.next_figurine = game.addEntity(new NextFigurine(this.board.cell_size, [340, 72], this.board.padding, game.context.next_figurine, game.context.next_figurine.image))
    }

    keydown(keycode, key, event, game) {
        if(game.context.gameOver) return;
        if(key == ' ') {
            const backup_points = deepCopy(this.figurine.figureData);
            const backup_pos = deepCopy(this.figurine.pos);
            
            this.figurine.rotateFigure();
            let points = this.figurine.points;
            let hits_something = false;
            for (let i = 0; i < points.length; i++) {
                const element = points[i];
                if(element[0] >= this.board.size[0]){
                    hits_something = true;
                    break;
                }
            }
            if(!hits_something) {
                hits_something = this.is_hitting_something(game, points);
            }
            if(hits_something){
                const w = this.figurine.size[0];
                const h = this.figurine.size[1];
                const x = this.figurine.pos[0];
                for(let m = x - 1; m >= x - (w - h); m--){
                    this.figurine.pos[0]--;
                    let points = this.figurine.points;
                    hits_something = false;
                    for (let i = 0; i < points.length; i++) {
                        const element = points[i];
                        if(element[0] >= this.board.size[0]){
                            hits_something = true;
                            break;
                        }
                    }
                    if(!hits_something) {
                        hits_something = this.is_hitting_something(game, points);
                    }
                    if(!hits_something){
                        break;
                    }
                }

            }
            if(hits_something){
                this.figurine.figureData = backup_points;
                this.figurine.pos = backup_pos;
            }else{
                this.figurine.play_sound();
            }

        }
        if(key == 'ArrowLeft') {
            this.figurine.pos = [this.figurine.pos[0] - 1, this.figurine.pos[1]];
            const points = this.figurine.points;
            let hits_something = false;
            for (let i = 0; i < points.length; i++) {
                const element = points[i];
                if(element[0] < 0){
                    hits_something = true;
                    break;
                }
            }
            if(!hits_something) {
                hits_something = this.is_hitting_something(game, points);
            }
            if(hits_something){
                this.figurine.pos = [this.figurine.pos[0] + 1, this.figurine.pos[1]];
            }else{
                this.figurine.play_sound();
            }
            this.clock -= .05;
        }
        if(key == 'ArrowRight') {
            this.figurine.pos = [this.figurine.pos[0] + 1, this.figurine.pos[1]];
            const points = this.figurine.points;
            let hits_something = false;
            for (let i = 0; i < points.length; i++) {
                const element = points[i];
                if(element[0] >= this.board.size[0]){
                    hits_something = true;
                    break;
                }
            }
            if(!hits_something) {
                hits_something = this.is_hitting_something(game, points);
            }
            if(hits_something){
                this.figurine.pos = [this.figurine.pos[0] - 1, this.figurine.pos[1]];
            }else{
                this.figurine.play_sound();
            }
            this.clock -= .05;
        }
        if(key == 'ArrowDown'){
            this.sped_up = true;
        }
    }

    keyup(keycode, key) {
        if(key == 'ArrowDown'){
            this.sped_up = false;
        }
    }

    is_hitting_something(game, points){
        const arr_entities = game.getEntitiesOfType(Point.name);
        for (let i_point = 0; i_point < points.length; i_point++) {
            const element = points[i_point];
            for(let i = 0; i < arr_entities.length; i++){
                const e = arr_entities[i];
                if(e.collides_with(element)){
                    return true;
                }
            }
        }
        return false;
    }
    
    update(game){
        if(game.context.gameOver) return;
        this.clock += game.deltaTime * (this.sped_up ? 6 : 1);
        this.time_elapsed += game.deltaTime;
        this.speed_boost_timer += game.deltaTime;
        let chd = false;
        while(this.speed_boost_timer > game.context.speed_boost){
            this.speed_boost_timer -= game.context.speed_boost;
            game.context.speed -= .1;
            game.context.speed = Math.max(game.context.speed, .15)
            chd = true;
        }
        if (chd && assets.lup.asset) {
            assets.lup.asset.currentTime = 0;
            assets.lup.asset.play();
        }
        while(this.clock > game.context.speed){
            this.clock -= game.context.speed;
            this.figurine.pos = [this.figurine.pos[0], this.figurine.pos[1] + 1]
            const points = this.figurine.points;
            let stop_figurine = false;
            for (let i = 0; i < points.length; i++) {
                const element = points[i];

                if(element[1] >= this.board.size[1]){
                    stop_figurine = true;
                    break;
                }
            }
            if(!stop_figurine){
                stop_figurine = this.is_hitting_something(game, points);
            }

            if(stop_figurine){   
                this.figurine.pos = [this.figurine.pos[0], this.figurine.pos[1] - 1];
                const points = this.figurine.points;
                let gameOver = false;
                for (let i = 0; i < points.length; i++) {
                    const [x,y] = points[i];
                    if(y <= 0){
                        game.setContext({
                            gameOver: true,
                        })
                        gameOver = true;
                    }
                    const arr = this.point_map[this.board.size[1] - y - 1] ?? [];
                    arr.push(game.addEntity(new Point(this.board.cell_size, this.board.pos, [x, y], this.board.padding, this.figurine.image)));
                    !this.point_map[this.board.size[1] - y - 1] && (this.point_map[this.board.size[1] - y - 1] = arr);
                }
                game.removeEntity(this.figurine);
                if(gameOver) return;
                let lines_completed;
                let m = false;
                while((lines_completed = this.point_map.map((e, i) => [e, i]).filter(([e,i]) => e.length >= this.board.size[0])).length){
                    const [elem, i] = lines_completed[0];
                    elem.forEach(e => game.removeEntity(e));
                    for(let i2 = i; i2 < this.point_map.length; i2++){
                        this.point_map[i2].forEach(e => e.pos[1]++);
                    }
                    this.point_map.splice(i, 1);
                    m = true;
                }
                m && this.play_line_sound()
                this.generate_figurine(game)
            }else{
                this.figurine.play_sound();
            }
        }
    }

    draw(ctx, size, game){       
        ctx.fillStyle = "#0002";
        ctx.fillRect(...this.board.pos, ...this.board.cell_size.map((e, i) => e * this.board.size[i] + (this.board.size[i] + 1) * this.board.padding));

        ctx.fillStyle = '#00000065';
        for (let i = 0, x = this.board.pos[0] + this.board.padding; i < this.board.size[0]; i++, x += this.board.cell_size[0] + this.board.padding) {
            for (let j = 0, y = this.board.pos[1] + this.board.padding; j < this.board.size[1]; j++, y += this.board.cell_size[1] + this.board.padding) {
                ctx.fillRect(x, y, ...this.board.cell_size);
            }
        }

        ctx.fillStyle = "#fff";
        ctx.fillText("SIGUIENTE", 340, 116);

        ctx.fillText("TIEMPO", 340, 172);
        ctx.fillText(this.time_elapsed.toFixed(0), 340, 152);
        
        ctx.fillText("SIG. INCR.", 340, 220);
        ctx.fillText((game.context.speed_boost - this.speed_boost_timer).toFixed(0), 340, 200);
    }
}

export class MusicController extends Entity{
    constructor(){
        super();
        this.music_assets = [
            assets.music_1,
            assets.music_2,
            assets.music_3,
            assets.music_4,
            assets.music_5,
            assets.music_6
        ]
        this.music_playing = null;
    }

    keydown(){
        if(this.music_playing === null){
            this.play_music();
        }
    }

    play_music(){
        this.music_playing && (this.music_playing.onended = () => {});
        this.music_playing = this.music_assets[Math.floor(Math.random() * this.music_assets.length)];
        if(!this.music_playing.asset){
            this.play_music();
            return;
        }
        this.music_playing.asset.play();
        this.music_playing.asset.onended = () => {
            this.play_music();
        }
    }
}

export class GameOverPanel extends MenuScreen {
    constructor(){
        super();
        this.zIndex = 10
        this.options = [
            {
                label: 'Volver a jugar',
                onSelect: (game) => {
                    game.removeEntitiesOfType(Figurine.name);
                    game.removeEntitiesOfType(NextFigurine.name);
                    game.removeEntitiesOfType(Point.name);
                    game.setContext({gameOver: false});
                    game.getEntitiesOfType(InGameScreen.name)[0]?.cleanup(game)
                    game.getEntitiesOfType(InGameScreen.name)[0]?.init(game)
                }
            },
            {
                label: 'Regresar al menú principal',
                onSelect: (game) => {
                    game.removeEntitiesOfType(Figurine.name);
                    game.removeEntitiesOfType(NextFigurine.name);
                    game.removeEntitiesOfType(Point.name);
                    game.removeEntitiesOfType(InGameScreen.name);
                    game.removeEntitiesOfType(GameOverPanel.name);
                    game.setContext({gameOver: false});
                    game.addEntity(new HomeScreen());
                }
            },
        ];
        this.pulsadas_antes = new Set();
    }

    update(){

    }

    keydown(keycode, key, event, game){
        if(!game.context.gameOver) {
            this.pulsadas_antes.add(key);
            return;
        }
        if(this.pulsadas_antes.has(key)) return;
        super.keydown(keycode, key, event, game)
    }

    keyup(kc, key){
        this.pulsadas_antes.delete(key);
    }

    draw(ctx, size, game){
        if(!game.context.gameOver) return;
        ctx.fillStyle = "#F005"
        ctx.fillRect(0, 0, ...size);
        
        ctx.font = this.font;
        ctx.fillStyle = "#fff";
        ctx.textAlign = 'center';
        ctx.fillText("Has perdido", size[0] / 2, size[1] /3)

        super.draw(ctx, size, game);
    }
}


export class ControlsScreen extends MenuScreen {
    constructor(){
        super();
        this.zIndex = 10
        this.options = [
            {
                label: 'Volver a jugar',
                onSelect: (game) => {
                    game.removeEntity(this);
                    game.addEntity(new HomeScreen());
                }
            }
        ];
        this.menuY = 500;
    }

    draw(ctx, size, game){
        ctx.font = this.font;
        ctx.fillStyle = "#fff";
        ctx.textAlign = 'center';
        ctx.fillText("Controles", size[0] / 2, size[1] /3)
        
        const line_spacing = 42;
        const lines = [
            "Flecha Izq para mover la figura a la izquieda",
            "Flecha Der para mover la figura a la derecha",
            "Flecha Abajo para incrementar velocidad de descenso",
            "Espacio para rotar figura",
        ]
        lines.forEach((e, i) => ctx.fillText(e, size[0] / 2, size[1] / 2.5 + line_spacing * i))
        

        super.draw(ctx, size, game);
    }
}