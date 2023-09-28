import { Pos, Récepteur } from "../types";
import ImageBank from "../../img/bank";
import { drawImage } from "../functions";
import ComponentProperties from "../properties";

export default class Lampe implements Récepteur{
    id: number;
    pos: Pos
    on: boolean
    name: string;
    R: number

    static nom = "Lampe"

    constructor(id, pos, resistance?: number){
        this.id = id
        this.pos = pos
        this.on = false
        this.name = this.constructor.name
        this.R = resistance ?? 3
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        // const P = this.R * I

        ctx.beginPath()
        ctx.arc(this.pos.x,this.pos.y, size/2, 0, Math.PI * 2)
        ctx.fill()

        drawImage(ctx, ImageBank.LampeOff, this.pos, size)
        ctx.fillText(this.name, this.pos.x + size/2, this.pos.y + size/2)
    };

    properties = () => [
        <ComponentProperties label="Allumé : " component={this} property="on" key={1} readonly={true}/>,
        <ComponentProperties label="Résistance : " suffix="Ω" component={this} property="resistance" key={2}/>,
    ];
}