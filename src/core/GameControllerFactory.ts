// src/core/GameControllerFactory.ts

import { GameController } from "./GameController";
import { GameMap } from "./GameMap";
import { UImanager } from "./UImanager";

export class GameControllerFactory {
    // Factory method to create a new instance of GameController
    static createNewGame(): GameController {
        const gameMap = new GameMap();  // Assuming the GameMap constructor can be called directly
        const uiManager = new UImanager();  // Create a new instance of UI manager

        // Create and initialize a new GameController
        const newGameController = new GameController(gameMap, uiManager);
        return newGameController;
    }
}
