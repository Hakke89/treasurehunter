// src/models/Treasure.ts

import { GameObject } from './GameObject';

export class Treasure extends GameObject {
    public width: number;
    public height: number;
    public status: boolean; // false equals collected

    constructor(x: number, y: number, color: string = 'darkgoldenrod') {
        super(x, y, color);
        this.width = 20;
        this.height = 20;
        this.status = true; // not collected by default
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color; // Set the treasure's color
        ctx.roundRect(this.positionX, this.positionY, this.width, this.height, [8, 8, 0, 0]); // Draw rounded rectangle
        ctx.fill(); // Fill the treasure's rectangle
        ctx.closePath();
    }

    collect() {
        this.status = false; // collected by player
    }
}