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