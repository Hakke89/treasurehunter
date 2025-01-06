// src/config.ts

// default settings mostly for testing

// Map settings
export let MAP_SETTINGS = {
    WIDTH: 900,          // 300, 650, 900
    HEIGHT: 300,
    WALL_COUNT: 100,      // Max defined by density and a formula
    WALL_DENSITY: 6     // Between 6 and 10; smaller makes the map fuller of walls
};

// Player settings
export let PLAYER_SETTINGS = {
    LIVES: 5,
    COLOR: "blue"
};

// Treasure settings
export let TREASURE_SETTINGS = {
    COUNT: 3
};

// Enemy settings
export let ENEMY_SETTINGS = {
    MOVEMENT_SPEED: 300, // 300 to 1000 Lower number means faster enemy (interval in milliseconds)
    COUNT: 1,            // Between 1 and 4
    COLOR: "red"
};
