import { assets } from "./asset_loader.js"
import { Entity } from "./engine.js";

export class Background extends Entity {
    constructor(){
        super()
        this.bg_img = assets.bg_image;
        this.w = null;
        this.h = null;
        this.canvas = null;
        this.img = null;
        this.pos = [0, 0];
        this.cell_size = [24, 24];
    }

    draw(ctx, [w, h]){
        if(this.canvas == null || w != this.w || h != this.h){
            this.canvas = document.createElement('canvas');
            this.w = canvas.width = w;
            this.h = canvas.height = h;
            const private_ctx = canvas.getContext("2d");
            private_ctx.fillStyle = this.bg_img.color;
            private_ctx.fillRect(0, 0, w, h);
            if(this.bg_img.asset){
                for (let x = this.pos[0]; x < w; x += this.cell_size[0]) {
                    for (let y = this.pos[1]; y < h; y += this.cell_size[1]) {
                        private_ctx.drawImage(this.bg_img.asset, x, y, ...this.cell_size);
                    }
                }
            } 
            private_ctx.fillStyle = "#111a";
            private_ctx.fillRect(0,0,w,h)

            const img = new Image();
            img.src = canvas.toDataURL('image/png');
            this.img = img;
        }
        ctx.drawImage(this.img, 0, 0)
    }
}