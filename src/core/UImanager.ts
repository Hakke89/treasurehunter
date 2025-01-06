// src/core/UImanager.ts

export class UImanager {
    private livesDisplay = document.querySelector("#livesDisplay");
    private treasuresDisplay = document.querySelector("#treasureDisplay");
    private messageDisplay = document.querySelector("#messageDisplay");
    private treasureQuotes: string[] = [
        "Shiver me timbers, the loot be ours!",
        "Ye beauty! This treasure'll make a fine tale back at port!",
        "Gold in me hands and a grin on me face!",
        "Another prize fer the takin'!",
        "A treasure well earned, by hook or by crook.",
        "Gold and jewels! Ye be richer than Blackbeard himself now, matey!"
    ];
    private hitQuotes: string[] = [
        "Arrr! That stings like a jellyfish!",
        "Blimey, that one hurt!",
        "Ye'll pay for that, ye scallywag!",
        "By the Kraken's teeth, that was a close one!",
        "Curse ye! That hit's gonna leave a mark!"
    ];

    constructor() {
        this.livesDisplay = document.querySelector("#livesDisplay");
        this.treasuresDisplay = document.querySelector("#treasureDisplay");
    }

    updateLives(lives: number) {
        if (this.livesDisplay) {
            this.livesDisplay.textContent = `${lives}`;
        }
    }

    updateTreasures(treasures: number) {
        if (this.treasuresDisplay) {
            this.treasuresDisplay.textContent = `${treasures}`;
        }
    }

    messageGameLog(text: string) {
        //switch case
        const newMessageElement = document.createElement("li");
        const line = document.createElement("li");
        switch (text) {
            case "treasure":
                newMessageElement.textContent = `TREASURE COLLECTED: ${this.getRandomTreasureQuote()}`
                break;
            case "lives":
                newMessageElement.textContent = `ENEMY HIT: ${this.getRandomHitQuote()}`
                break;
            case "game over":
                newMessageElement.textContent = "GAME OVER: Arrr! Tis the end of yer journey, ye lily-livered landlubber!"
                break;
            case "game won":
                newMessageElement.textContent = "GAME WON: Huzzah! Ye've bested the seas and claimed the bounty, true pirate style!"
                break;
            case "User ended the game":
                newMessageElement.textContent = "GAME ENDED"
                break;
            case "newGame":
                return;
            default:
                return;
        }
        //add a new list item in the ul list of messageDisplay
        if (this.messageDisplay) {
            if (this.messageDisplay.children.length > 0) {
                line.textContent = "------------------";
                this.messageDisplay.prepend(line);
            }
            this.messageDisplay.prepend(newMessageElement);
        }
    }

    resetMessageGameLog(): void {
        if (this.messageDisplay) {
            while (this.messageDisplay.firstChild) {
                this.messageDisplay.removeChild(this.messageDisplay.firstChild);
            }
        }
    }

    // Function to get a random treasure quote
    getRandomTreasureQuote(): string {
        const randomIndex = Math.floor(Math.random() * this.treasureQuotes.length);
        return this.treasureQuotes[randomIndex];
    }

    // Example usage to get a random hit quote
    getRandomHitQuote(): string {
        const randomIndex = Math.floor(Math.random() * this.hitQuotes.length);
        return this.hitQuotes[randomIndex];
    }
}