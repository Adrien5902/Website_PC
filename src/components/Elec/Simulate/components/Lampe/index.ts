import { Component, Pos } from "../types";
import ImageBank from "../../img/bank";
import { drawImage } from "../functions";

export default class Lampe implements Component{
    id: number;
    pos: Pos
    on: boolean
    name: string;

    static nom = "Lampe"

    constructor(id, pos){
        this.id = id
        this.pos = pos
        this.on = false
        this.name = this.constructor.name
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        drawImage(ctx, ImageBank.LampeOff, this.pos, size)
        ctx.fillText(this.name, this.pos.x + size/2, this.pos.y + size/2)
    };

    isPowerSource = () => true
}