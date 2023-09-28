export interface Component{
    draw : (ctx: CanvasRenderingContext2D, size: number) => void
    pos: Pos
    id: number
    name: string
    properties? : () => JSX.Element[]
}

export interface PowerSource extends Component{
    getVoltage: () => number
}

export interface Récepteur extends Component{
    R: number
}

export type Pos = {x: number, y: number}
export type Side = -1 | 0 | 1

export class ComponentSide{
    component: Component
    side: Side

    constructor(component: Component, side: Side) {
        this.component = component
        this.side = side
    }

    getPos = (componentSize: number) : Pos => ({x: this.component.pos.x + componentSize/2 * this.side, y: this.component.pos.y})
}

export class Connection{
    a: ComponentSide
    b: ComponentSide

    constructor(a: ComponentSide, b: ComponentSide){
        this.a = a
        this.b = b
    }

    draw(ctx: CanvasRenderingContext2D, componentSize: number){
        ctx.beginPath();

        const a = this.a.getPos(componentSize)
        const b = this.b.getPos(componentSize)
        
        ctx.moveTo(a.x, a.y);

        a.x += componentSize/2 * this.a.side
        b.x += componentSize/2 * this.b.side
        
        ctx.lineTo(a.x, a.y);

        let pos: Pos = {x: 0, y: 0}
        if(a.x > b.x){
            pos.x = this.a.side > 0 ? a.x : b.x
            pos.y = this.a.side > 0 ? b.y : a.y
        }else{
            pos.x = this.a.side > 0 ? b.x : a.x
            pos.y = this.a.side > 0 ? a.y : b.y
        }
        
        ctx.lineTo(pos.x, pos.y)
        
        ctx.lineTo(b.x , b.y);
        ctx.lineTo(b.x - componentSize/2 * this.b.side, b.y);
        ctx.stroke();
    }

    getComponents = () => [this.a.component, this.b.component]
}