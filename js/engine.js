
export class Clock {
    lastTime = 0;
    deltaTime = 0;

    constructor(lastTime) {
        this.lastTime = lastTime;
    }

    tick(time){
        if (time < this.lastTime) return;
        this.deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
    }
}


export class Game {
    constructor(canvas, context){
        this.entities = [];
        this._entities_map = new Map();
        this.clock = new Clock(performance.now());
        this.canvas = canvas;
        this.canvas_ctx = canvas.getContext('2d');
        this.canvas_size = [ this.canvas.width, this.canvas.height ];
        this.context = Object.freeze({});
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }

    addEntity(entity){
        if(!(entity instanceof Entity)) {
            throw Error('That element is not an Entity');
        }
        this.entities.push(entity);
        this.entities = this.entities.sort((a, b) => a.zIndex - b.zIndex);
        !this._entities_map.has(entity.constructor.name) && this._entities_map.set(entity.constructor.name, []);
        this._entities_map.get(entity.constructor.name).push(entity);
        entity.init(this);
        return entity;
    }

    getEntitiesOfType(class_name){
        return this._entities_map.get(class_name) ?? [];
    }

    getEntityOfType(class_name){
        return this._entities_map.get(class_name)[0];
    }

    removeEntity(entity){
        const f = e => e !== entity; 
        const entities_class = entity.constructor.name;
        const n = this._entities_map.get(entities_class);
        this._entities_map.set(entities_class, n.filter(f));
        this.entities = this.entities.filter(f);
    }

    removeEntitiesOfType(class_name){
        this.entities = this.entities.filter(e => e.constructor.name == class_name);
        this._entities_map.delete(class_name);
    }

    doLoop(time){
        time && this.clock.tick(time);
        this.update();
        this.draw(this.canvas_ctx, this.canvas_size, this);
        requestAnimationFrame(this.doLoop.bind(this));
    }

    update(){
        this.entities.forEach(e => e.update(this));
        this.entities.forEach(e => e.lateUpdate(this));
    }

    draw(ctx, size, game) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#aaaaff';
        ctx.strokeStyle = '#000';
        this.entities.forEach(e => e.draw(ctx, this.canvas_size, this));
    }

    keydown(event) {
        this.entities.forEach(e => e.keydown(event.keyCode, event.key, event, this))
    }

    keyup(event) {
        this.entities.forEach(e => e.keyup(event.keyCode, event.key, event, this))
    }

    get deltaTime() {
        return this.clock.deltaTime;
    }

    setContext (v) {
        this.context = { ...this.context, ...v};
    }
}

export class Entity {
    constructor(zIndex = 0) {
        this.zIndex = zIndex;
    }
    init(game) { }
    update(game) { }
    lateUpdate(game) { }
    draw(ctx, size, game) { }
    keydown(keycode, key, event, game) { }
    keyup(keycode, key, event, game) { }
}