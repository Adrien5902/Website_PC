import { Component, Pos } from "../types";
import ImageBank from "../../img/bank";
import { drawImage } from "../functions";
import ComponentProperties from "../properties";

export default class Générateur implements Component{
    id: number;
    pos: Pos;
    on: boolean
    name: string;
    volt: number

    static nom = "Générateur"

    constructor(id, pos){
        this.id = id
        this.pos = pos
        this.on = true
        this.name = Générateur.nom
        this.volt = 0
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        const {x, y} = this.pos
        const img = this.on ? ImageBank.GénérateurOn : ImageBank.GénérateurOff

        ctx.fillText("+", x + size/2, y - size/2);
        ctx.fillText("-", x - size/2, y - size/2);
        drawImage(ctx, img, this.pos, size)
        ctx.fillText(this.name, this.pos.x + size/2, this.pos.y + size/2)
    };

    properties = () => [
        <ComponentProperties label="Activé : " property="on" component={this} key={1}/>,
        <ComponentProperties label="Voltage : " type="range" suffix="V" property="volt" component={this} key={2}/>
    ]

    isPowerSource = () => true
}