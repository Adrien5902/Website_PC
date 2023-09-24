import { Component, Pos } from "../types";
import ImageBank from "../../img/bank";
import { drawImage } from "../functions";

export default class Interrupteur implements Component{
    id: number;
    pos: Pos;
    opened: boolean
    name: string;

    static nom = "Interrupteur"

    constructor(id, pos){
        this.id = id
        this.pos = pos
        this.opened = true
        this.name = this.constructor.name
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        const img = this.opened ? ImageBank.InterrupteurOpened : ImageBank.InterrupteurOpened

        drawImage(ctx, img, this.pos, size)
    };
    
    isPowerSource = () => true
}