// src/core/GameMap.ts

import { MAP_SETTINGS } from "../config";
import { GameObject } from '../models/GameObject';
import { Character } from "../models/Character";
import { Wall } from '../models/Wall';
import { Player } from "../models/Player";
import { Treasure } from "../models/Treasures";
import { Enemy } from "../models/Enemy";

const { WALL_DENSITY: MAP_WALL_DENSITY } = MAP_SETTINGS;

export class GameMap {
    public width: number = MAP_SETTINGS.WIDTH;
    public height: number = MAP_SETTINGS.HEIGHT;
    public objects: GameObject[] = [];
    public player: Player | null = null;
    public enemies: Enemy[] = [];
    public positions: Set<string> = new Set<string>();

    private initialized: boolean = false;

    constructor() {
        // Initialize the game map (no objects or player)
    }

    public isInitialized(): boolean {
        return this.initialized;
    }

    private generatePositionKey(x: number, y: number): string {
        return `${x},${y}`;
    }

    private generateRandomCoordinates(spacing: number = 20): { x: number, y: number } {
        const maxWidth = Math.floor(this.width / spacing);
        const maxHeight = Math.floor(this.height / spacing);
        const x = Math.floor(Math.random() * maxWidth) * spacing;
        const y = Math.floor(Math.random() * maxHeight) * spacing;
        return { x, y };
    }

    reset(): void {
        this.width = MAP_SETTINGS.WIDTH;
        this.height = MAP_SETTINGS.HEIGHT;
        this.objects = []; // Reset objects (treasures, walls, etc.)
        this.player = null; // Reset player
        this.enemies = []; // Reset enemies
        this.positions = new Set<string>();
        this.initialized = false;
    }

    initialize(): void {
        this.initialized = true;
    }

    renderGameMap(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'rgb(251, 255, 193)';
        ctx.fillRect(0, 0, this.width, this.height);
        this.objects.forEach((object) => {
            if (!(object instanceof Player)) object.render(ctx);
        });

        this.enemies.forEach((enemy) => enemy.render(ctx));

        if (this.player) this.player.render(ctx);
    }

    addObject(object: GameObject | Character): void {
        this.objects.push(object);
        this.positions.add(this.generatePositionKey(object.positionX, object.positionY));
    }

    removeObject(object: GameObject | Character): void {
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
            this.positions.delete(this.generatePositionKey(object.positionX, object.positionY));
        }
    }

    createPlayer(): void {
        const playerX = this.width / 2;
        const playerY = this.height / 2;

        this.player = new Player(playerX, playerY);
        this.positions.add(this.generatePositionKey(playerX, playerY));
        this.addObject(this.player);
    }

    createEnemy(enemyX: number, enemyY: number): void {
        const positionKey = this.generatePositionKey(enemyX, enemyY);
        if (!this.positions.has(positionKey)) {
            const newEnemy = new Enemy(enemyX, enemyY);
            this.enemies.push(newEnemy);
            this.addObject(newEnemy);
        }
    }

    createWalls(numberOfWalls: number, spacing: number = 20): void {
        const maxWalls = (this.width / spacing) * (this.height / spacing) / MAP_WALL_DENSITY;
        if (numberOfWalls > maxWalls) numberOfWalls = maxWalls;

        let wallsCreated = 0;
        while (wallsCreated < numberOfWalls) {
            const { x, y } = this.generateRandomCoordinates(spacing);

            if (this.isPositionAvailable(x, y) && !this.isTooCloseToPlayer(x, y, 40) && !this.isTooCloseToEnemy(x, y, 20)) {
                const wall = new Wall(x, y);
                this.addObject(wall);
                wallsCreated++;
            }
        }
    }

    isTooCloseToPlayer(x: number, y: number, playerBuffer: number): boolean {
        if (this.player) {
            const playerX = this.player.positionX;
            const playerY = this.player.positionY;
            return (
                x >= playerX - playerBuffer && x <= playerX + playerBuffer &&
                y >= playerY - playerBuffer && y <= playerY + playerBuffer
            );
        }
        return false;
    }

    isTooCloseToEnemy(x: number, y: number, enemyBuffer: number): boolean {
        return this.enemies.some((enemy) => {
            const enemyX = enemy.positionX;
            const enemyY = enemy.positionY;
            return (
                x >= enemyX - enemyBuffer && x <= enemyX + enemyBuffer &&
                y >= enemyY - enemyBuffer && y <= enemyY + enemyBuffer
            );
        });
    }

    createTreasures(numberOfTreasures: number, spacing: number = 20): void {
        let treasuresCreated = 0;
        while (treasuresCreated < numberOfTreasures) {
            const { x, y } = this.generateRandomCoordinates(spacing);

            if (this.isPositionAvailable(x, y) && !this.isTooCloseToPlayer(x, y, 60)) {
                const treasure = new Treasure(x, y);
                this.addObject(treasure);
                treasuresCreated++;
            }
        }
    }

    placeEnemies(count: number): void {
        const positions = [
            { x: 10, y: 10 },
            { x: this.width - 10, y: 10 },
            { x: this.width - 10, y: this.height - 10 },
            { x: 10, y: this.height - 10 }
        ];

        for (let i = 0; i < count; i++) {
            const { x, y } = positions[i % positions.length];
            this.createEnemy(x, y); // Place enemies at specified positions
        }
    }

    treasureCount(): number {
        return this.objects.filter((object) => object instanceof Treasure).length;
    }

    hasTreasures(): boolean {
        return this.objects.some((object) => object instanceof Treasure);
    }

    wallCount(): number {
        return this.objects.filter((object) => object instanceof Wall).length;
    }

    isPositionAvailable(x: number, y: number): boolean {
        return !this.positions.has(this.generatePositionKey(x, y));
    }

    checkCollision(player: Player): boolean {
        let collected = false;
        this.objects.forEach((object) => {
            if (object instanceof Treasure) {
                if (
                    player.positionX + player.radius > object.positionX &&
                    player.positionX < object.positionX + object.width &&
                    player.positionY + player.radius > object.positionY &&
                    player.positionY < object.positionY + object.height
                ) {
                    object.collect();
                    this.removeObject(object);
                    collected = true;
                }
            }
        });
        return collected;
    }

    checkCollisionWithWalls(character: Character): boolean {
        return this.objects.some((object) => {
            if (object instanceof Wall) {
                const charLeft = character.positionX - character.radius;
                const charRight = character.positionX + character.radius;
                const charTop = character.positionY - character.radius;
                const charBottom = character.positionY + character.radius;

                const wallLeft = object.positionX;
                const wallRight = object.positionX + object.width;
                const wallTop = object.positionY;
                const wallBottom = object.positionY + object.height;

                return charRight > wallLeft && charLeft < wallRight && charBottom > wallTop && charTop < wallBottom;
            }
            return false;
        });
    }

    checkCollisionWithPlayer(player: Player, enemy: Enemy): boolean {
        return (
            player.positionX + player.radius > enemy.positionX &&
            player.positionX < enemy.positionX + enemy.radius &&
            player.positionY + player.radius > enemy.positionY &&
            player.positionY < enemy.positionY + enemy.radius
        );
    }

    checkCollisionWithEnemies(enemy: Enemy): boolean {
        return this.enemies.some((otherEnemy) => {
            if (otherEnemy !== enemy) {
                const eLeft = enemy.positionX - enemy.radius;
                const eRight = enemy.positionX + enemy.radius;
                const eTop = enemy.positionY - enemy.radius;
                const eBottom = enemy.positionY + enemy.radius;

                const oELeft = otherEnemy.positionX - otherEnemy.radius;
                const oERight = otherEnemy.positionX + otherEnemy.radius;
                const oETop = otherEnemy.positionY - otherEnemy.radius;
                const oEBottom = otherEnemy.positionY + otherEnemy.radius;

                return eRight > oELeft && eLeft < oERight && eBottom > oETop && eTop < oEBottom;
            }
            return false;
        });
    }
}
