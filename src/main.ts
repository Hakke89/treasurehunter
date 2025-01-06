// src/main.ts

import "./css/styles.css";
import { GameController } from "./core/GameController";
import { FormController } from "./core/FormController";
import { FormModel } from "./models/Form";
import { initializeKeyEventHandling, cleanupKeyEventHandling } from "./core/KeyEventHandler";
import { initializeGameMap } from "./core/GameSetup";
import { GameControllerFactory } from "./core/GameControllerFactory"; // Import the GameController factory

const gameForm = document.getElementById('gameForm') as HTMLFormElement;
const gameSection = document.getElementById('game-section') as HTMLElement;
const resetButton = document.querySelector("#resetBtn") as HTMLButtonElement;
const newGameButton = document.querySelector("#newGameBtn") as HTMLButtonElement;

let gameController: GameController; // Declare a variable for GameController

if (!window.gameStarted) {
    window.gameStarted = true;
    initializeForm();
    newGameButton.addEventListener("click", handleNewGame);
    resetButton.addEventListener("click", handleResetGame); // Uncomment if you want reset functionality
}

function initializeForm() {
    gameForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = getFormData();
        const formController = new FormController(formData);

        if (formController.validateForm()) {
            hideForm();
            //store formData in the localStorage
            localStorage.setItem("formData", JSON.stringify(formData));
            // Start the new game with the stored formData
            const storedFormData = JSON.parse(localStorage.getItem("formData")!) as FormModel;
            startGame(storedFormData);
        }
    });
}

function handleNewGame() {
    // End the current game and reset the game state
    gameController.resetGame();
    cleanupKeyEventHandling();
    showForm();
    window.gameStarted = false;
}

function handleResetGame() {
    gameController.resetGame();
    cleanupKeyEventHandling();
    //Get formData from storage
    const storedFormData = JSON.parse(localStorage.getItem("formData")!) as FormModel;
    // Start the new game with the stored formData
    startGame(storedFormData);
}

function startGame(formData: FormModel) {
    // Initialize a new GameController and GameMap through their respective factories
    gameController = GameControllerFactory.createNewGame();
    const gameMap = initializeGameMap(formData);
    gameController.setGameMap(gameMap);
    gameController.startGame();
    initializeKeyEventHandling(gameController);
}

function getFormData(): FormModel {
    const lives = parseInt((document.getElementById('livesInput') as HTMLSelectElement).value);
    const gridDimensions = (document.getElementById('gridDimensionsInput') as HTMLSelectElement).value;
    const walls = parseInt((document.getElementById('wallsInput') as HTMLSelectElement).value);
    const treasures = parseInt((document.getElementById('treasuresInput') as HTMLSelectElement).value);
    const enemies = parseInt((document.getElementById('enemiesInput') as HTMLSelectElement).value);
    const gameSpeed = (document.querySelector('input[name="gameSpeed"]:checked') as HTMLInputElement)?.value;

    return new FormModel(lives, gridDimensions, walls, treasures, enemies, gameSpeed);
}

function hideForm() {
    gameForm.style.display = 'none';
    gameSection.style.display = 'flex';
    newGameButton.style.display = 'block';
    resetButton.style.display = 'block';
}

function showForm() {
    gameForm.style.display = 'grid';
    gameSection.style.display = 'none';
    newGameButton.style.display = 'none';
    resetButton.style.display = 'none';
}
