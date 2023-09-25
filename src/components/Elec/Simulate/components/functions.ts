import { Component, ComponentSide, Pos } from "./types";

export function drawDot(ctx: CanvasRenderingContext2D, {x, y}: Pos){
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

export function drawImage(ctx: CanvasRenderingContext2D, src: string, pos: Pos, size: number){
    const {x, y} = pos
    const img = new Image()
    img.src = src
    ctx.drawImage(img, x - size/2, y - size/2, size, size)
}

export function drawLine(ctx: CanvasRenderingContext2D, from: Pos, to: Pos){
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

export const getCtx = (canvas: React.MutableRefObject<HTMLCanvasElement>) => canvas.current.getContext("2d")