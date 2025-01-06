// src/models/GameObjects.ts

export abstract class GameObject {
    positionX: number;
    positionY: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        this.positionX = x;
        this.positionY = y;
        this.color = color;
    }

    abstract render(ctx: CanvasRenderingContext2D): void; // abstract method
}