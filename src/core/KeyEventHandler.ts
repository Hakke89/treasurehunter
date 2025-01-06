// src/core/KeyEventHandler.ts

import { GameController } from './GameController';

let isKeyPressed = false;
let activeGameController: GameController | null = null;

// Define the event handler functions outside the initialization function to ensure the same reference
function handleKeyDown(event: KeyboardEvent): void {
    if (!activeGameController) return;  // If no game controller is active, ignore the event

    // Prevent default scroll behavior for arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

    // Prevent multiple key presses at once
    if (!isKeyPressed) {
        activeGameController.movePlayer(event.key);
        isKeyPressed = true;
    }

    // Debugging: Log current objects on the map if 'c' is pressed
    if (event.key === "c") {
        console.log("Current objects on the map:");
        activeGameController.gameMap.objects.forEach((object) => {
            console.log(object);
        });
        console.log("Number of walls:", activeGameController.gameMap.wallCount());
    }

    // Add key to end game
    if (event.key === "x") {
        activeGameController.endGame("User ended the game");
    }

}

function handleKeyUp(): void {
    isKeyPressed = false;
}

// Initializes key event listeners for the game controller
export function initializeKeyEventHandling(gameController: GameController): void {
    // If there's already an active game controller, clean up previous listeners
    if (activeGameController && activeGameController !== gameController) {
        cleanupKeyEventHandling();
    }

    // Set the new game controller as active
    activeGameController = gameController;

    // Add new keydown and keyup event listeners for the new controller
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
}

// Removes key event listeners and resets the active controller
export function cleanupKeyEventHandling(): void {
    if (!activeGameController) return;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);

    // Reset the active controller after cleanup
    activeGameController = null;
}
