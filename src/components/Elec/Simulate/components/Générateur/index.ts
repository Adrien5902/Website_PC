import { Component, Pos } from "../types";
import ImageBank from "../../img/bank";
import { drawImage } from "../functions";

export default class Générateur implements Component{
    id: number;
    pos: Pos;
    on: boolean
    name: string;

    static nom = "Générateur"

    constructor(id, pos){
        this.id = id
        this.pos = pos
        this.on = true
        this.name = this.constructor.name
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        const {x, y} = this.pos
        const img = this.on ? ImageBank.GénérateurOn : ImageBank.GénérateurOff

        ctx.fillText("+", x + size/2, y - size/2);
        ctx.fillText("-", x - size/2, y - size/2);
        drawImage(ctx, img, this.pos, size)
    };

    isPowerSource = () => true
}