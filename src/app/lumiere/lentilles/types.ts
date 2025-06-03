import type { Pos } from "@/types/canvas";


export class Rayon {
    label: string;
    id: string;
    color: string;
    enabled: boolean;

    constructor(id: string, label: string, color: string) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.enabled = true;
    }
}

export class Lentille {
    pos: number;
    focalLength: number;
    imagePoint: Pos;
    virtualImage?: boolean;
    focalRayonHitPoint?: Pos;
    gamma: number;
    id: number;

    constructor(id: number, pos: number, focalLength: number) {
        this.id = id;
        this.pos = pos;
        this.focalLength = focalLength;
        this.imagePoint = { x: 0, y: 0 };
        this.gamma = 0;
    }
}

export interface Rayons {
    delta: Rayon;
    O: Rayon;
    F: Rayon;
    others: Rayon[];
}