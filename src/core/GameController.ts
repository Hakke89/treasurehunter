// src/core/GameController.ts

import { GameMap } from "./GameMap";
import { UImanager } from "./UImanager";
import { ENEMY_SETTINGS } from "../config";

export class GameController {
    private uiManager: UImanager;
    private gameOver: boolean = false;
    private timerId: ReturnType<typeof setInterval> | undefined;
    private gameLoopId: number | undefined; // Store the ID of the game loop for cancellation
    public gameMap: GameMap;
    public gameControlID: number = Math.floor(Math.random() * 100) + 1;
    private isGameRunning: boolean = false;

    constructor(gameMap: GameMap, uiManager: UImanager) {
        this.gameMap = gameMap;
        this.uiManager = uiManager;
    }

    setGameMap(gameMap: GameMap): void {
        this.gameMap = gameMap;
    }

    // Method to reset the game state
    resetGame(): void {
        // reset UI
        this.uiManager.resetMessageGameLog();

        // Cancel any game loop animation frame
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
            this.gameLoopId = undefined;
        }

        // Clear any active interval or timer
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = undefined;
        }

        // Reset the map state and set it to null for garbage collection
        if (this.gameMap) {
            this.gameMap.reset();
            this.gameMap = null as unknown as GameMap; // Remove reference for GC
        }

        // Nullify any other references for garbage collection
        this.uiManager = null as unknown as UImanager;
        this.isGameRunning = false; // Ensure the flag is set to false on reset

        // Log the cleanup for debugging
        console.log(`GameController ${this.gameControlID} reset and prepared for garbage collection.`);
    }

    startGame(): void {
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        this.isGameRunning = true; // Set flag to true when starting the game

        if (this.isGameRunning) {
            const enemyMovementInterval = ENEMY_SETTINGS.MOVEMENT_SPEED;

            const enemyIsMoving = (): void => {
                if (!this.isGameRunning || this.gameOver) return; // Check game state before moving enemies
                this.moveEnemies();
            };

            this.timerId = setInterval(enemyIsMoving, enemyMovementInterval); // Store the interval ID for cleanup
        }

        const gameLoop = (): void => {
            if (!this.isGameRunning || this.gameOver) {
                cancelAnimationFrame(this.gameLoopId!); // Stop the game loop if the game is over
                return;
            }

            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const player = this.gameMap.player;
                if (this.gameMap.player) {
                    this.gameMap.checkCollision(this.gameMap.player);
                    this.uiManager.updateLives(this.gameMap.player.lives);
                    this.uiManager.updateTreasures(this.gameMap.treasureCount());
                }

                // End game conditions
                if (player && player.lives <= 0) {
                    player.color = "gray";
                    this.gameMap.renderGameMap(ctx);
                    this.endGame("game over");
                    return;
                }
                if (!this.gameMap.hasTreasures()) {
                    this.gameMap.renderGameMap(ctx);
                    this.endGame("game won");
                    return;
                }
                this.gameMap.renderGameMap(ctx);
            }
            this.gameLoopId = requestAnimationFrame(gameLoop); // Request next frame
        };

        this.gameLoopId = requestAnimationFrame(gameLoop); // Start the game loop
    }

    endGame(reason: string): void {
        this.isGameRunning = false; // Set flag to false to indicate game has ended
        this.gameOver = true;

        if (this.timerId) {
            clearInterval(this.timerId);  // Clear the interval for moving enemies
            this.timerId = undefined;
        }

        this.uiManager.messageGameLog(reason);

        this.endGameRender();
    }

    movePlayer(direction: string): void {
        const player = this.gameMap.player;
        if (!player) {
            return;
        }
        const originalX = player.positionX;
        const originalY = player.positionY;

        player.move(direction);

        if (player.positionX < 0 || player.positionX > this.gameMap.width) {
            player.positionX = originalX;
        }
        if (player.positionY < 0 || player.positionY > this.gameMap.height) {
            player.positionY = originalY;
        }

        if (this.gameMap.checkCollisionWithWalls(player)) {
            player.positionX = originalX;
            player.positionY = originalY;
        }
        if (this.gameMap.checkCollision(player)) {
            this.uiManager.messageGameLog("treasure");
        }
    }

    moveEnemies(): void {
        const player = this.gameMap.player;
        if (!player) {
            return;
        }

        this.gameMap.enemies.forEach((enemy) => {
            const originalX = enemy.positionX;
            const originalY = enemy.positionY;

            const deltaX = player.positionX - enemy.positionX;
            const deltaY = player.positionY - enemy.positionY;

            let direction = 0;
            let preferredAxis = "";

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? 1 : -1;
                preferredAxis = "x";
            } else {
                direction = deltaY > 0 ? 1 : -1;
                preferredAxis = "y";
            }

            enemy.move(direction, preferredAxis);

            if (this.gameMap.checkCollisionWithWalls(enemy)) {
                enemy.positionX = originalX;
                enemy.positionY = originalY;

                const moves = [
                    { direction: Math.sign(deltaX), axis: "x" },
                    { direction: Math.sign(deltaY), axis: "y" },
                    { direction: -Math.sign(deltaX), axis: "x" },
                    { direction: -Math.sign(deltaY), axis: "y" }
                ];

                for (const move of moves) {
                    enemy.move(move.direction, move.axis);
                    if (!this.gameMap.checkCollisionWithWalls(enemy)) {
                        break;
                    } else {
                        enemy.positionX = originalX;
                        enemy.positionY = originalY;
                    }
                }
            }

            if (this.gameMap.checkCollisionWithEnemies(enemy)) {
                enemy.positionX = originalX;
                enemy.positionY = originalY;
            }

            if (this.gameMap.checkCollisionWithPlayer(player, enemy)) {
                player.decreaseLives();
                this.uiManager.updateLives(player.lives);
                this.uiManager.messageGameLog("lives");
                enemy.returnToHome();
            }
        });
    }

    endGameRender(): void {
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        const wallColor = "brown";
        const wallSize = 20;

        let currentRow = 0; // Start from the top row
        let currentCol = 0;

        // Function to render the wall at a specific position
        const renderWall = (row: number, col: number): void => {
            ctx.fillStyle = wallColor;
            ctx.fillRect(col * wallSize, row * wallSize, wallSize, wallSize);
        };

        // Function to render a chest in the center of the canvas
        const renderChest = () => {
            const chestWidth = 120; // Increased chest width
            const chestHeight = 100; // Increased chest height
            const chestX = (this.gameMap.width - chestWidth) / 2; // Centered horizontally
            const chestY = this.gameMap.height - chestHeight - 40; // Positioned closer to the bottom

            // Chest body (yellow rectangle)
            ctx.fillStyle = "yellow";
            ctx.fillRect(chestX, chestY, chestWidth, chestHeight);

            // Chest lid (rounded top)
            ctx.fillStyle = "#D9A500"; // Darker yellow for the lid
            ctx.beginPath();
            ctx.moveTo(chestX, chestY); // Starting point at the bottom left corner of the chest
            ctx.lineTo(chestX + chestWidth, chestY); // Bottom right corner
            ctx.arcTo(chestX + chestWidth, chestY - 40, chestX + chestWidth / 2, chestY - 40, 40); // Rounded corner
            ctx.arcTo(chestX, chestY - 40, chestX, chestY, 40); // Rounded corner
            ctx.closePath();
            ctx.fill(); // Fill the lid with the color

            // Chest hinges (small dark brown rectangles at the top corners)
            ctx.fillStyle = "brown";
            ctx.fillRect(chestX + 10, chestY - 10, 10, 15); // Left hinge
            ctx.fillRect(chestX + chestWidth - 20, chestY - 10, 10, 15); // Right hinge

            // Chest lock (small dark rectangle in the center)
            ctx.fillStyle = "black";
            ctx.fillRect(chestX + chestWidth / 2 - 10, chestY + chestHeight / 2 - 5, 20, 10); // Lock in the middle
        };

        // Render walls and chest together
        const intervalId = setInterval(() => {
            renderWall(currentRow, currentCol); // Render the wall at the current position

            // Move to the next column
            currentCol++;

            // If we've rendered all columns in the current row, move to the next row (downwards)
            if (currentCol >= (this.gameMap.width) / wallSize) {
                currentCol = 0; // Reset the column to 0
                currentRow++; // Move down to the next row
            }

            // If we've rendered all rows, stop the interval
            if (currentRow >= (this.gameMap.height) / wallSize) {
                clearInterval(intervalId); // Stop the interval once all rows are rendered

                // Render the chest once walls are done
                renderChest();
            }
        }, 15); // Delay between wall rendering steps
    }
}