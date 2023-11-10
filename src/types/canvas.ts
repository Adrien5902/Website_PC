export type Pos = {x: number, y: number}

export function getMousePos(canvas: HTMLCanvasElement, evt: React.MouseEvent) {
    const rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    } as Pos
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

export function drawDashedLine(ctx: CanvasRenderingContext2D, from: Pos, to: Pos, dashLength: number = 5) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const numDashes = Math.floor(distance / dashLength);

    const deltaX = dx / numDashes;
    const deltaY = dy / numDashes;

    let shouldDraw = true;

    for (let i = 0; i < numDashes; i++) {
        if (shouldDraw) {
            ctx.lineTo(from.x + i * deltaX, from.y + i * deltaY);
        } else {
            ctx.moveTo(from.x + i * deltaX, from.y + i * deltaY);
        }

        shouldDraw = !shouldDraw;
    }

    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

export function drawDot(ctx: CanvasRenderingContext2D, {x, y}: Pos, size = ctx.lineWidth/2){
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

export function setColor(ctx: CanvasRenderingContext2D, color: string){
    ctx.fillStyle = color
    ctx.strokeStyle = color
}