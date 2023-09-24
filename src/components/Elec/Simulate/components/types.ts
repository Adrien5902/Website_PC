export interface Component{
    draw : (ctx: CanvasRenderingContext2D, size: number) => void
    pos: Pos
    id: number
    name: string
    isPowerSource: () => boolean
}

export type Pos = {x: number, y: number}
export type Side = -1 | 0 | 1