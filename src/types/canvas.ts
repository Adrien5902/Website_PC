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

export function drawIndiceText(
	ctx: CanvasRenderingContext2D,
	text: string,
	pos: Pos,
	size: number
) {
	ctx.font = `${size / 2}px sans-serif`;
	ctx.fillText(text, pos.x, pos.y);
	ctx.font = `${(size / 5) * 4}px sans-serif`;
}

export function drawCircleAround(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number
) {
	ctx.beginPath();
	ctx.arc(x, y, size / 2, 0, 360);
	ctx.stroke();
}

export function drawArrow(
	ctx: CanvasRenderingContext2D,
	origin: Pos,
	angle: number,
	size: number,
) {
	const arrowSize = size / 2;

	const leftAngle = angle - Math.PI / 4;
	const leftWingPos = { x: origin.x + arrowSize * Math.cos(leftAngle), y: origin.y + arrowSize * Math.sin(leftAngle) };
	const rightAngle = angle + Math.PI / 4;
	const rightWingPos = { x: origin.x + arrowSize * Math.cos(rightAngle), y: origin.y + arrowSize * Math.sin(rightAngle) };

	drawLine(ctx, leftWingPos, origin);
	drawLine(ctx, rightWingPos, origin);
}