export interface Component{
    draw : (ctx: CanvasRenderingContext2D, size: number) => void
    pos: Pos
    id: number
    name: string
    isPowerSource: () => boolean
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
}