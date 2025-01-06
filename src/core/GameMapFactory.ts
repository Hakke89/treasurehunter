// src/core/GameMapFactory.ts

import { GameMap } from "./GameMap";

export class GameMapFactory {
    // Factory method to create a new instance of GameMap
    static createNewGameMap(): GameMap {
        const newGameMap = new GameMap();
        newGameMap.initialize();
        return newGameMap;
    }
}
