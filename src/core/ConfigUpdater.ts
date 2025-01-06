// src/core/ConfigUpdater.ts

import { MAP_SETTINGS, PLAYER_SETTINGS, TREASURE_SETTINGS, ENEMY_SETTINGS } from '../config';
import { Form } from '../models/Form';

export class ConfigUpdater {
    public updateConfig(form: Form): void {
        this.updateMapSettings(form.gridDimensions, form.walls);
        this.updatePlayerSettings(form.lives);
        this.updateTreasureSettings(form.treasures);
        this.updateEnemySettings(form.enemies);
        this.updateGameSpeed(form.gameSpeed);
    }

    private updateMapSettings(gridDimensions: string, wallsCount: number): void {
        const [width, height] = gridDimensions.split('x').map(Number);
        MAP_SETTINGS.WIDTH = width;
        MAP_SETTINGS.HEIGHT = height;
        MAP_SETTINGS.WALL_COUNT = wallsCount;
    }

    // Private method to update player settings
    private updatePlayerSettings(lives: number): void {
        PLAYER_SETTINGS.LIVES = lives;
    }

    // Private method to update treasure settings
    private updateTreasureSettings(treasureCount: number): void {
        TREASURE_SETTINGS.COUNT = treasureCount;
    }

    // Private method to update enemy settings
    private updateEnemySettings(enemyCount: number): void {
        ENEMY_SETTINGS.COUNT = enemyCount;
    }

    // Private method to update game speed
    private updateGameSpeed(gameSpeed: string): void {
        switch (gameSpeed) {
            case 'fast':
                ENEMY_SETTINGS.MOVEMENT_SPEED = 200;
                break;
            case 'medium':
                ENEMY_SETTINGS.MOVEMENT_SPEED = 400;
                break;
            case 'slow':
                ENEMY_SETTINGS.MOVEMENT_SPEED = 800;
                break;
            default:
                console.warn("Unknown game speed value:", gameSpeed);
        }
    }
}
