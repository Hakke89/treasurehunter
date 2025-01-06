// src/models/Player.ts
import { Character } from './Character';
import { PLAYER_SETTINGS } from "../config";

export class Player extends Character {
    public speed: number;
    public lives: number;

    constructor(x: number, y: number, radius: number = 10) {
        super(x, y, radius, PLAYER_SETTINGS.COLOR);
        this.speed = 20; // steps it takes grid
        this.lives = PLAYER_SETTINGS.LIVES; // Initialize player with 3 lives
    }

    render(ctx: CanvasRenderingContext2D): void {
        // draw player
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    move(direction: string): void {
        //case direction
        switch (direction) {
            case 'ArrowUp':
                this.positionY -= this.speed;
                break;
            case 'ArrowDown':
                this.positionY += this.speed;
                break;
            case 'ArrowLeft':
                this.positionX -= this.speed;
                break;
            case 'ArrowRight':
                this.positionX += this.speed;
                break;
        }
    };

    decreaseLives() {
        if (this.lives > 0) {
            this.lives--;
        }
    }
}