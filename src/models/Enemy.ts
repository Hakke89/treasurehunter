// src/models/Enemy.ts

import { Character } from './Character';
import { ENEMY_SETTINGS } from "../config";

export class Enemy extends Character {
    private speed: number;
    public startingX: number;  // Store the starting X position
    public startingY: number;  // Store the starting Y position

    constructor(x: number, y: number, radius: number = 10) {
        super(x, y, radius, ENEMY_SETTINGS.COLOR);
        this.speed = 20;

        // Store the starting position
        this.startingX = x;
        this.startingY = y;
    }

    render(ctx: CanvasRenderingContext2D): void {
        // draw enemy
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    move(direction: number, axis: string): void {
        // Move the enemy in the given direction along the specified axis (x or y)
        switch (axis) {
            case 'x':
                this.positionX += direction * this.speed;
                break;
            case 'y':
                this.positionY += direction * this.speed;
                break;
        }
    }

    // Method to return the enemy to its starting position
    returnToHome(): void {
        this.positionX = this.startingX;
        this.positionY = this.startingY;
    }
}
