// src/core/GameSetup.ts

import { MAP_SETTINGS } from "../config";
import { GameMapFactory } from "./GameMapFactory";
import { GameMap } from "./GameMap";
import { FormModel } from "../models/Form";
import { ConfigUpdater } from "./ConfigUpdater";


export function initializeGameMap(formData: FormModel): GameMap {

    // Update configuration with form data
    const configUpdater = new ConfigUpdater();
    configUpdater.updateConfig(formData);

    // Initialize canvas size based on map settings
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = MAP_SETTINGS.WIDTH;
    canvas.height = MAP_SETTINGS.HEIGHT;

    // Create a new GameMap using the GameMapFactory
    const gameMap = GameMapFactory.createNewGameMap();

    // Set up the player, enemies, treasures, and walls
    gameMap.createPlayer();
    gameMap.placeEnemies(formData.enemies);
    gameMap.createTreasures(formData.treasures);
    gameMap.createWalls(formData.walls);

    return gameMap; // Return the newly created game map
}
