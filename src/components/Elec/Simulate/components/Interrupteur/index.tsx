import { Component, Pos } from "../types";
import ImageBank from "../../img/bank";
import { drawImage } from "../functions";
import ComponentProperties from "../properties";

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
        const img = this.opened ? ImageBank.InterrupteurOpened : ImageBank.InterrupteurClosed

        drawImage(ctx, img, this.pos, size)
        ctx.fillText(this.name, this.pos.x + size/2, this.pos.y + size/2)
    };

    properties = () => [
        <ComponentProperties label="Ouvert : " component={this} property="opened" key={1}/>
    ];
    
    isPowerSource = () => true
}