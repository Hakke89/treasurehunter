// src/core/FormValidator.ts

import { Form } from "../models/Form";

export class FormValidator {
    private errors: string[] = [];

    public validateForm(form: Form): boolean {
        this.errors = [];

        if (!this.isValidLives(form.lives)) {
            this.errors.push("Invalid number of lives.");
        }

        if (!this.isValidGridDimensions(form.gridDimensions)) {
            this.errors.push("Invalid grid dimensions.");
        }

        if (!this.isValidWalls(form.walls)) {
            this.errors.push("Invalid number of walls.");
        }

        if (!this.isValidTreasures(form.treasures)) {
            this.errors.push("Invalid number of treasures.");
        }

        if (!this.isValidEnemies(form.enemies)) {
            this.errors.push("Invalid number of enemies.");
        }

        if (!this.isValidGameSpeed(form.gameSpeed)) {
            this.errors.push("Invalid game speed.");
        }

        return this.errors.length === 0;
    }

    private isValidLives(lives: number): boolean {
        return lives >= 1 && lives <= 5;
    }

    private isValidGridDimensions(gridDimensions: string): boolean {
        const validDimensions = ["300x300", "500x500", "900x900", "500x300", "900x500"];
        return validDimensions.includes(gridDimensions);
    }

    private isValidWalls(walls: number): boolean {
        return walls >= 10 && walls <= 100;
    }

    private isValidTreasures(treasures: number): boolean {
        const validTreasures = [5, 10, 15, 20];
        return validTreasures.includes(treasures);
    }

    private isValidEnemies(enemies: number): boolean {
        return enemies >= 1 && enemies <= 4;
    }

    private isValidGameSpeed(gameSpeed: string): boolean {
        const validSpeeds = ["slow", "medium", "fast"];
        return validSpeeds.includes(gameSpeed);
    }

    public getErrors(): string[] {
        return this.errors;
    }

    public sanitizeInput(input: string): string {
        return input.replace(/[<>/"";]/g, "");
    }
}
