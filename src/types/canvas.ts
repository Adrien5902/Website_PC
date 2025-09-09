export type Pos = { x: number; y: number };

export function getMousePos(canvas: HTMLCanvasElement, evt: React.MouseEvent | React.TouchEvent) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	const { clientX, clientY } = "touches" in evt ? evt.touches[0] : evt;

	return {
		x: (clientX - rect.left) * scaleX,
		y: (clientY - rect.top) * scaleY,
	} as Pos;
}

export function drawImage(
	ctx: CanvasRenderingContext2D,
	src: string,
	pos: Pos,
	size: number,
) {
	const { x, y } = pos;
	const img = new Image();
	img.src = src;
	ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
}

export function drawLine(ctx: CanvasRenderingContext2D, from: Pos, to: Pos) {
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}

export function drawDashedLine(
	ctx: CanvasRenderingContext2D,
	from: Pos,
	to: Pos,
	dashLength = 20
) {
	const canvasWidth = ctx.canvas.width;
	const canvasHeight = ctx.canvas.height;

	// Prevent extremely dense dashes by capping based on canvas size
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const maxDashes = Math.sqrt(canvasWidth ** 2 + canvasHeight ** 2) / 2;
	const desiredDashes = Math.floor(distance / dashLength);

	if (desiredDashes > maxDashes) {
		dashLength = distance / maxDashes;
	}

	ctx.save();
	ctx.beginPath();
	ctx.setLineDash([dashLength, dashLength]);
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
	ctx.setLineDash([]);
	ctx.restore();
}


export function drawDot(
	ctx: CanvasRenderingContext2D,
	{ x, y }: Pos,
	size = ctx.lineWidth / 2,
) {
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

export function setColor(ctx: CanvasRenderingContext2D, color: string) {
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
}
