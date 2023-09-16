import { Entity } from "./engine.js";

const figurines = [
    {
        figurePoints: [
            ['*',' '],
            ['*',' '],
            ['*','*'],
        ],
        color: "#cc6600"
    },
    {
        figurePoints: [
            [' ','*'],
            [' ','*'],
            ['*','*'],
        ],
        color: "#0000cc"
    },
    {
        figurePoints: [
            ['*',' '],
            ['*','*'],
            [' ','*'],
        ],
        color: "#00cc00"
    },
    {
        figurePoints: [
            [' ','*'],
            ['*','*'],
            ['*',' '],
        ],
        color: "#cc0000"
    },
    {
        figurePoints: [
            ['*','*'],
            ['*','*'],
        ],
        color: "#cccc00"
    },
    {
        figurePoints: [
            ['*',],
            ['*',],
            ['*',],
            ['*',],
        ],
        color: "#00cdcd"
    },
    {
        figurePoints: [
            ['*','*','*'],
            [' ','*',' ']
        ],
        color: "#9900cc"
    }
]


class Figurine extends Entity {
    constructor(cell_size, board_pos, pos, padding, figureData = {
        figurePoints: [
            ['*',' '],
            ['*',' '],
            ['*','*'],
        ],
    }, color = '#fff') {
        super(1);
        this.board_pos = board_pos;
        this.pos = pos;
        this.cell_size = cell_size;
        this.padding = padding;
        this.figureData = figureData;
        this.color = color;
        this.rotation = 0;
    }

    draw(ctx, size, game){
        ctx.fillStyle = this.color;
        for (let i = 0, y = this.board_pos[1] + this.padding + (this.cell_size[0] + this.padding) * this.pos[1]; i < this.figureData.figurePoints.length; i++, y += this.cell_size[1] + this.padding) {
            for (let j = 0, x = this.board_pos[0] + this.padding + (this.cell_size[1] + this.padding) * this.pos[0]; j < this.figureData.figurePoints[i].length; j++, x += this.cell_size[0] + this.padding) {
                if(this.figureData.figurePoints[i][j] !== ' '){
                    ctx.fillRect(x, y, ...this.cell_size);
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
}

        
class Point extends Entity {
    constructor(cell_size, board_pos, pos, padding, color = '#fff') {
        super(1);
        this.board_pos = board_pos;
        this.pos = pos;
        this.cell_size = cell_size;
        this.padding = padding;
        this.color = color;
        this.rotation = 0;
    }

    draw(ctx, size, game){
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.board_pos[0] + this.padding + (this.cell_size[1] + this.padding) * this.pos[0], 
            this.board_pos[1] + this.padding + (this.cell_size[0] + this.padding) * this.pos[1], 
            ...this.cell_size
        );
    }
    
    collides_with(point = [0, 0]){
        return this.pos[0] == point[0] && this.pos[1] == point[1];
    }
}

export class HomeScreen extends Entity {
    constructor(){
        super();
        this.selected_option = 0;
        this.options = [
            {
                label: 'Jugar',
                onSelect: (game) => {
                    game.removeEntity(this)
                }
            },
            {
                label: 'Opciones'
            },
        ];
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
        ctx.fillStyle = this.background;
        ctx.fillRect(0, 0, ...size);
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