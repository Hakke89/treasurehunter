// src/models/Form.ts

export interface Form {
    lives: number;
    gridDimensions: string;
    walls: number;
    treasures: number;
    enemies: number;
    gameSpeed: string;
}

export class FormModel implements Form {
    constructor(
        public lives: number,
        public gridDimensions: string,
        public walls: number,
        public treasures: number,
        public enemies: number,
        public gameSpeed: string
    ) { }

}
