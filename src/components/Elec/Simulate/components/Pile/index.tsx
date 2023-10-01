import { PowerSource } from "../types";
import ImageBank from "../../img/bank";
import { Pos, drawImage } from "../../../../../types/canvas";

export default class Pile implements PowerSource{
    id: number;
    pos: Pos;
    name: string;
    volt: number

    static nom = "Pile"
    static defaultImage = ImageBank.PileOff

    constructor(id, pos){
        this.id = id
        this.pos = pos
        this.name = Pile.nom
        this.volt = 5
    }

    draw = (ctx: CanvasRenderingContext2D, size: number) => {
        const {x, y} = this.pos

        ctx.fillText("+", x + size/2, y - size/2);
        ctx.fillText("-", x - size/2, y - size/2);
        drawImage(ctx, ImageBank.PileOn, this.pos, size)
        ctx.fillText(this.name, this.pos.x + size/2, this.pos.y + size/2)
    };

    getVoltage = () => this.volt
}