// src/models/Character.ts

export abstract class Character {
    public positionX: number;
    public positionY: number;
    public radius: number;
    public color: string;

    constructor(x: number, y: number, radius: number, color: string) {
        this.positionX = x;
        this.positionY = y;
        this.radius = radius;
        this.color = color;
    }

    abstract render(ctx: CanvasRenderingContext2D): void; // abstract method
}