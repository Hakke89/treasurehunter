// src/models/Walls.ts

import { GameObject } from './GameObject';

export class Wall extends GameObject {
    public width: number;
    public height: number;

    constructor(x: number, y: number, color: string = 'brown') {
        super(x, y, color);
        this.width = 20;
        this.height = 20;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
        ctx.closePath();
    }
}