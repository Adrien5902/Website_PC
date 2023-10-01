import { Récepteur } from "../types";
import ImageBank from "../../img/bank";
import {ComponentProperty} from "../properties";
import { Pos, drawImage } from "../../../../../types/canvas";

export default class Lampe implements Récepteur{
    id: number;
    pos: Pos
    name: string;
    R: number
    I: number
    P: number
    U: number;

    static nom = "Lampe"

    constructor(id, pos, resistance?: number){
        this.id = id
        this.pos = pos
        this.name = this.constructor.name
        this.R = resistance ?? 3
        this.I = 0
        this.P = 0
        this.U = 0
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        this.U = this.R * this.I
        this.P = this.U * this.I

        const lightnessRatio = this.P/100
        const lightness = lightnessRatio > 1 ? 1 : lightnessRatio < 0 ? 0 : lightnessRatio

        if(lightness > 0){
            if(lightnessRatio > 1){
                ctx.beginPath()
                ctx.fillStyle = `rgba(255, 255, 0, 0.5)`
                ctx.arc(this.pos.x, this.pos.y, size/2 + ((lightnessRatio-1) * size/2), 0, Math.PI * 2)
                ctx.fill()
            }
    
            ctx.fillStyle = `rgba(255,255,0, ${lightness})`
            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, size/2, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.fillStyle = "black"

        drawImage(ctx, ImageBank.LampeOff, this.pos, size)
        ctx.fillText(this.name, this.pos.x + size/2, this.pos.y + size/2)
    };

    properties = () => [
        <ComponentProperty label="Allumée : " component={this} property="P" key={1} readonly={true} type="boolean"/>,
        <ComponentProperty label="Résistance : " suffix=" Ω" component={this} property="R" key={2}/>,
        <ComponentProperty label="Puissance : " suffix=" W" component={this} property="P" key={3} readonly={true}/>,
    ];
}