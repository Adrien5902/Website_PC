import {
	forwardRef,
	type MouseEvent,
	type TouchEvent,
	useImperativeHandle,
	useRef,
} from "react";
import useCanvas from "../../../src/hooks/Canvas";
import {
	type Pos,
	drawLine,
	setColor,
	drawDot,
	drawDashedLine,
	getMousePos,
} from "../../../src/types/canvas";
import { Lentille, type Rayons } from ".";
import type { LentilleControlsRef } from "./LentillesControls";

interface Props {
	lentilles: React.MutableRefObject<Lentille[]>;
	objectPos: React.MutableRefObject<Pos>;
	moving: React.MutableRefObject<{
		type: "focalLength" | "object";
		object: Lentille | null;
	}>;
	rayons: Rayons;
	controlsRef: React.MutableRefObject<LentilleControlsRef>;
	infiniteObject: boolean;
	infiniteObjectAngle: React.MutableRefObject<number>;
}

export interface LentilleCanvasRef {
	refresh: () => void;
	originY: number;
	width: number;
	height: number;
	size: number;
}

export const LentillesCanvas = forwardRef<LentilleCanvasRef, Props>(
	(
		{
			lentilles,
			objectPos,
			moving,
			rayons,
			controlsRef,
			infiniteObject,
			infiniteObjectAngle,
		}: Props,
		ref,
	) => {
		useImperativeHandle(ref, () => ({
			refresh: () => {
				drawCanvas();
			},
			originY: originY,
			width: canvasRef.current.width,
			height: canvasRef.current.height,
			size,
		}));

		const size = 80;
		const arrowSize = size / 2;
		const mousePosRef = useRef<Pos>({ x: 0, y: 0 });

		const canvasRef = useCanvas(
			(_canvasSize) => {
				originY = canvasRef.current ? canvasRef.current.height / 2 : size;
				drawCanvas();
			},
			() => {
				if (!lentilles.current.length) {
					objectPos.current = { x: size, y: canvasRef.current?.height / 4 };
					lentilles.current = [
						new Lentille(1, canvasRef.current.width / 2, size * 4),
					];
				}
			},
		);

		let originY = canvasRef.current ? canvasRef.current.height / 2 : size;

		const isMouseNear = (pos: Pos) =>
			Math.abs(mousePosRef.current.x - pos.x) < size / 2 &&
			Math.abs(mousePosRef.current.y - pos.y) < size / 2;

		function drawArrow(
			ctx: CanvasRenderingContext2D,
			origin: Pos,
			side: "left" | "right" | "up" | "down",
			size = arrowSize,
		) {
			const pos1 = { ...origin };
			const pos2 = { ...origin };

			if (side === "left" || side === "right") {
				pos1.y += size;
				pos2.y -= size;

				const sign = side === "left" ? 1 : -1;

				pos1.x += size * sign;
				pos2.x += size * sign;
			} else {
				pos1.x += size;
				pos2.x -= size;

				const sign = side === "up" ? 1 : -1;

				pos1.y += size * sign;
				pos2.y += size * sign;
			}

			drawLine(ctx, pos1, origin);
			drawLine(ctx, pos2, origin);
		}

		function drawIndiceText(
			ctx: CanvasRenderingContext2D,
			text: string,
			x: number,
			y: number,
		) {
			ctx.font = `${size / 2}px sans-serif`;
			ctx.fillText(text, x, y);
			ctx.font = `${(size / 5) * 4}px sans-serif`;
		}

		function drawCircleAround(
			ctx: CanvasRenderingContext2D,
			x: number,
			y: number,
		) {
			ctx.beginPath();
			ctx.arc(x, y, size / 2, 0, 360);
			ctx.stroke();
		}

		function drawCanvas() {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
			setColor(ctx, "#FFF");
			ctx.font = `${(size / 5) * 4}px sans-serif`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			setColor(ctx, "#000");
			ctx.lineWidth = size / 12;

			const xStart = { x: size, y: originY };
			const xEnd = { x: canvas.width - size, y: originY };
			drawLine(ctx, xStart, xEnd);
			drawArrow(ctx, xEnd, "right");

			ctx.fillText("Δ", xEnd.x, xEnd.y + size);

			function calculateInfinitePointObjectPos(
				XPos: number,
				angle: number,
			): Pos & { sign: number } {
				const Height = originY - XPos * Math.tan(angle);

				const sign = Height > canvas.height ? -1 : 1;

				const X = XPos - (originY * sign) / Math.tan(angle);

				return {
					x: Height > canvas.height ? X : Height > 0 ? 0 : X,
					y: Height > canvas.height ? canvas.height : Height > 0 ? Height : 0,
					sign,
				};
			}

			const AInfinitePos = calculateInfinitePointObjectPos(
				lentilles.current[0]?.pos - lentilles.current[0]?.focalLength,
				infiniteObjectAngle.current,
			);

			const Apos = infiniteObject
				? AInfinitePos
				: { x: objectPos.current.x, y: originY };

			const BInfinitePos = calculateInfinitePointObjectPos(
				lentilles.current[0]?.pos,
				infiniteObjectAngle.current,
			);

			const BPos = infiniteObject
				? BInfinitePos
				: { x: Apos.x, y: originY - objectPos.current.y };

			ctx.fillText(
				`A${infiniteObject ? "∞" : ""}`,
				Apos.x,
				Apos.y + size * 1.3 * AInfinitePos.sign,
			);
			ctx.fillText(
				`B${infiniteObject ? "∞" : ""}`,
				BPos.x + size,
				BPos.y + size * BInfinitePos.sign,
			);

			if (!infiniteObject) {
				setColor(ctx, "#FF0000");

				drawDot(ctx, Apos, size / 10);

				drawLine(ctx, Apos, BPos);
				drawArrow(ctx, BPos, BPos.y < Apos.y ? "up" : "down");

				if (
					(isMouseNear(BPos) && !moving.current) ||
					moving.current?.object === null
				) {
					ctx.beginPath();
					ctx.arc(BPos.x, BPos.y, size / 2, 0, 360);
					ctx.stroke();
				}
			}

			for (const lentille of lentilles.current) {
				setColor(ctx, "#000");

				ctx.fillText("L", lentille.pos + size / 3, originY + size);
				drawIndiceText(
					ctx,
					lentille.id.toString(),
					lentille.pos + size * 0.8,
					originY + size * 1.2,
				);

				const FPos = { x: lentille.pos - lentille.focalLength, y: originY };
				const _FPos = { x: lentille.pos + lentille.focalLength, y: originY }; //_F = F'

				if (moving.current?.object === lentille) {
					drawCircleAround(
						ctx,
						moving.current.type === "focalLength" ? _FPos.x : lentille.pos,
						originY,
					);
				}

				if (!moving.current) {
					if (isMouseNear(_FPos)) {
						drawCircleAround(ctx, _FPos.x, originY);
					} else if (isMouseNear({ x: lentille.pos, y: originY })) {
						drawCircleAround(ctx, lentille.pos, originY);
					}
				}

				drawLine(
					ctx,
					{ x: FPos.x, y: FPos.y - size / 5 },
					{ x: FPos.x, y: FPos.y + size / 5 },
				);
				ctx.fillText("F", FPos.x, FPos.y + size);
				drawIndiceText(
					ctx,
					lentille.id.toString(),
					FPos.x + size * 0.5,
					FPos.y + size * 1.2,
				);
				drawLine(
					ctx,
					{ x: _FPos.x, y: _FPos.y - size / 5 },
					{ x: _FPos.x, y: _FPos.y + size / 5 },
				);
				ctx.fillText("F'", _FPos.x, _FPos.y + size);
				drawIndiceText(
					ctx,
					lentille.id.toString(),
					_FPos.x + size * 0.5,
					_FPos.y + size * 1.2,
				);

				const LSize = Math.max(
					Math.abs(objectPos.current.y),
					lentille.imagePoint ? Math.abs(lentille.imagePoint.y - originY) : 0,
					size,
				);

				const LTop = { x: lentille.pos, y: originY - LSize - size };
				const LBottom = { x: lentille.pos, y: originY + LSize + size };

				drawLine(ctx, LTop, LBottom);
				drawArrow(ctx, LTop, lentille.focalLength > 0 ? "up" : "down");
				drawArrow(ctx, LBottom, lentille.focalLength < 0 ? "up" : "down");
			}

			const tempLentilles = lentilles.current
				.filter((l) => objectPos.current.x < l.pos)
				.sort((a, b) => a.pos - b.pos);

			const rayonsEnabled = Object.values(rayons).filter(
				(r) => r.enabled,
			).length;

			let lastPosA = Apos;
			let lastPosB = BPos;
			for (const i in tempLentilles) {
				const lentille = tempLentilles[i];
				lentille.focalRayonHitPoint = {
					x: lentille.pos,
					y:
						((originY - (infiniteObject && i === "0" ? lastPosA : lastPosB).y) /
							(lentille.pos -
								lentille.focalLength -
								(infiniteObject && i === "0" ? lastPosA : lastPosB).x)) *
							(lentille.pos -
								(infiniteObject && i === "0" ? lastPosA : lastPosB).x) +
						(infiniteObject && i === "0" ? lastPosA : lastPosB).y,
				};

				lentille.imagePoint = {
					x:
						lastPosB.x +
						((lentille.pos - lastPosB.x) / (originY - lastPosB.y)) *
							(lentille.focalRayonHitPoint.y - lastPosB.y),
					y: lentille.focalRayonHitPoint.y,
				};

				lentille.gamma =
					(originY - lentille.imagePoint.y) / (originY - lastPosB.y);

				const nextLentille = tempLentilles[Number(i) + 1];

				lentille.virtualImage =
					lentille.imagePoint.x < lentille.pos ||
					(nextLentille && lentille.imagePoint.x > nextLentille.pos);

				if (rayonsEnabled >= 2) {
					const _Apos: Pos = { x: lentille.imagePoint.x, y: originY };
					setColor(ctx, "#FF0000");

					if (lentille.virtualImage) {
						drawDashedLine(ctx, _Apos, lentille.imagePoint);
					} else {
						drawLine(ctx, _Apos, lentille.imagePoint);
					}

					drawDot(ctx, _Apos);

					drawArrow(
						ctx,
						lentille.imagePoint,
						lentille.imagePoint.y > _Apos.y ? "down" : "up",
					);

					ctx.fillText("A", _Apos.x + size / 3, originY + (size / 4) * 3);
					drawIndiceText(
						ctx,
						lentille.id.toString(),
						_Apos.x + size * 0.9,
						originY + size,
					);
					ctx.fillText(
						"B",
						lentille.imagePoint.x + size / 3,
						lentille.imagePoint.y + size / 3,
					);
					drawIndiceText(
						ctx,
						lentille.id.toString(),
						lentille.imagePoint.x + size * 0.9,
						lentille.imagePoint.y + size * 0.6,
					);
				}

				lastPosA = { x: lentille.imagePoint.x, y: originY };
				lastPosB = lentille.imagePoint;
			}

			function drawRayon(initialPos: Pos, endingInitialPos: Pos) {
				let lastPos = endingInitialPos;

				drawLine(ctx, initialPos, lastPos);

				for (const i in tempLentilles) {
					const lentille = tempLentilles[i];

					const nextLentille = tempLentilles[Number(i) + 1];

					if (lentille.imagePoint.x < lentille.pos) {
						drawDashedLine(ctx, lastPos, lentille.imagePoint);
					}

					if (nextLentille) {
						const nextLentilleEndingY =
							((lentille.imagePoint.y - lastPos.y) /
								(lentille.imagePoint.x - lastPos.x)) *
								(nextLentille.pos - lentille.imagePoint.x) +
							lentille.imagePoint.y;

						const nextPos = { x: nextLentille.pos, y: nextLentilleEndingY };
						drawLine(ctx, lastPos, nextPos);

						if (lentille.imagePoint.x > nextPos.x) {
							drawDashedLine(ctx, nextPos, lentille.imagePoint);
						}

						lastPos = nextPos;
					} else {
						const endingY =
							((lentille.imagePoint.y - lastPos.y) /
								(lentille.imagePoint.x - lastPos.x)) *
								(canvas.width - lentille.imagePoint.x) +
							lentille.imagePoint.y;

						drawLine(ctx, lastPos, { x: canvas.width, y: endingY });

						if (
							infiniteObject &&
							(lentille.imagePoint.x > canvasRef.current.width ||
								lentille.imagePoint.x < 0)
						) {
							setColor(ctx, "#000000");
							if (initialPos === Apos) {
								ctx.fillText(
									"A'∞",
									canvasRef.current.width - size * 1.3,
									endingY + size * 1.4,
								);
							}

							if (initialPos === BPos) {
								ctx.fillText(
									"B'∞",
									canvasRef.current.width - size * 1.3,
									endingY - size * 0.9,
								);
							}
						}
					}
				}
			}

			if (!infiniteObject && rayons.delta.enabled && tempLentilles[0]) {
				setColor(ctx, rayons.delta.color);
				drawRayon(BPos, { x: tempLentilles[0].pos, y: BPos.y });
			}

			if (rayons.O.enabled && tempLentilles[0]) {
				setColor(ctx, rayons.O.color);
				drawRayon(BPos, { x: tempLentilles[0].pos, y: originY });
			}

			if (rayons.F.enabled && tempLentilles[0]) {
				setColor(ctx, rayons.F.color);
				drawRayon(
					infiniteObject ? Apos : BPos,
					tempLentilles[0].focalRayonHitPoint,
				);
			}

			controlsRef.current.refresh();
		}

		function handleMouseMove(e: MouseEvent | TouchEvent) {
			mousePosRef.current = getMousePos(canvasRef.current, e);

			if (moving.current) {
				if (
					mousePosRef.current.x > size &&
					mousePosRef.current.x < canvasRef.current.width - size
				) {
					switch (moving.current?.type) {
						case "object":
							if (!moving.current?.object) {
								objectPos.current.x = mousePosRef.current.x;
								objectPos.current.y = originY - mousePosRef.current.y;
							} else {
								moving.current.object.pos = mousePosRef.current.x;
							}

							break;

						case "focalLength":
							moving.current.object.focalLength =
								mousePosRef.current.x - moving.current.object.pos;
							break;
					}
				}
			}

			drawCanvas();
		}

		function handleMouseDown(e: React.MouseEvent | React.TouchEvent) {
			e.preventDefault();
			if (
				isMouseNear({
					x: objectPos.current.x,
					y: originY - objectPos.current.y,
				})
			) {
				moving.current = { type: "object", object: null };
			}

			for (const lentille of lentilles.current) {
				if (
					isMouseNear({
						x: lentille.pos + lentille.focalLength,
						y: originY,
					})
				) {
					moving.current = { object: lentille, type: "focalLength" };
				} else if (
					isMouseNear({
						x: lentille.pos,
						y: originY,
					})
				) {
					moving.current = { object: lentille, type: "object" };
				}
			}
		}

		return (
			<canvas
				id="lentilles-canvas"
				className="shadow-box"
				ref={canvasRef}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchStart={handleMouseDown}
			/>
		);
	},
);
