import {
	forwardRef,
	type MouseEvent,
	type TouchEvent,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import useCanvas from "../../../hooks/Canvas";
import {
	type Pos,
	drawLine,
	setColor,
	drawDot,
	drawDashedLine,
	getMousePos,
} from "../../../types/canvas";
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

		useEffect(() => {
			lentilles.current = [
				new Lentille(1, canvasRef.current.width / 2, size * 4),
			];
		}, [lentilles]);

		const canvasRef = useCanvas((_canvasSize) => {
			objectPos.current = { x: size, y: canvasRef.current?.height / 4 };

			originY = canvasRef.current ? canvasRef.current.height / 2 : size;

			drawCanvas();
		});

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

				const coef = side === "left" ? 1 : -1;

				pos1.x += size * coef;
				pos2.x += size * coef;
			} else {
				pos1.x += size;
				pos2.x -= size;

				const coef = side === "up" ? 1 : -1;

				pos1.y += size * coef;
				pos2.y += size * coef;
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

		function drawCircleAround(ctx, x, y) {
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

			const Apos = infiniteObject
				? {
						x: 0,
						y:
							originY -
							((lentilles.current[0]?.pos ?? 0) -
								(lentilles.current[0]?.focalLength ?? 0)) *
								Math.tan(infiniteObjectAngle.current),
					}
				: { x: objectPos.current.x, y: originY };
			const Bpos = infiniteObject
				? {
						x: 0,
						y:
							originY -
							(lentilles.current[0]?.pos ?? 0) *
								Math.tan(infiniteObjectAngle.current),
					}
				: { x: Apos.x, y: originY - objectPos.current.y };

			ctx.fillText(`A${infiniteObject ? "∞" : ""}`, Apos.x, Apos.y + size);
			ctx.fillText(`B${infiniteObject ? "∞" : ""}`, Bpos.x + size / 3, Bpos.y);

			if (!infiniteObject) {
				setColor(ctx, "#FF0000");

				drawDot(ctx, Apos, size / 10);

				drawLine(ctx, Apos, Bpos);
				drawArrow(ctx, Bpos, Bpos.y < Apos.y ? "up" : "down");

				if (
					(isMouseNear(Bpos) && !moving.current) ||
					moving.current?.object === null
				) {
					ctx.beginPath();
					ctx.arc(Bpos.x, Bpos.y, size / 2, 0, 360);
					ctx.stroke();
				}
			}

			lentilles.current.sort((a, b) => a.pos - b.pos);

			const rayonsEnabled = Object.values(rayons).filter(
				(r) => r.enabled,
			).length;

			let lastPosA = Apos;
			let lastPosB = Bpos;
			for (const i in lentilles.current) {
				const lentille = lentilles.current[i];
				setColor(ctx, "#000");

				ctx.fillText("L", lentille.pos + size / 3, originY + size);
				drawIndiceText(
					ctx,
					lentille.id.toString(),
					lentille.pos + size * 0.8,
					originY + size * 1.2,
				);

				const Fpos = { x: lentille.pos - lentille.focalLength, y: originY };
				const _Fpos = { x: lentille.pos + lentille.focalLength, y: originY }; //_F = F'

				if (moving.current?.object === lentille) {
					drawCircleAround(
						ctx,
						moving.current.type === "focalLength" ? _Fpos.x : lentille.pos,
						originY,
					);
				}

				if (!moving.current) {
					if (isMouseNear(_Fpos)) {
						drawCircleAround(ctx, _Fpos.x, originY);
					} else if (isMouseNear({ x: lentille.pos, y: originY })) {
						drawCircleAround(ctx, lentille.pos, originY);
					}
				}

				drawLine(
					ctx,
					{ x: Fpos.x, y: Fpos.y - size / 5 },
					{ x: Fpos.x, y: Fpos.y + size / 5 },
				);
				ctx.fillText("F", Fpos.x, Fpos.y + size);
				drawIndiceText(
					ctx,
					lentille.id.toString(),
					Fpos.x + size * 0.5,
					Fpos.y + size * 1.2,
				);
				drawLine(
					ctx,
					{ x: _Fpos.x, y: _Fpos.y - size / 5 },
					{ x: _Fpos.x, y: _Fpos.y + size / 5 },
				);
				ctx.fillText("F'", _Fpos.x, _Fpos.y + size);
				drawIndiceText(
					ctx,
					lentille.id.toString(),
					_Fpos.x + size * 0.5,
					_Fpos.y + size * 1.2,
				);

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

				const Lsize = Math.max(Math.abs(objectPos.current.y));

				const Ltop = { x: lentille.pos, y: originY - Lsize - size };
				const Lbottom = { x: lentille.pos, y: originY + Lsize + size };

				drawLine(ctx, Ltop, Lbottom);
				drawArrow(ctx, Ltop, lentille.focalLength > 0 ? "up" : "down");
				drawArrow(ctx, Lbottom, lentille.focalLength < 0 ? "up" : "down");
				const nextLentille = lentilles.current[Number(i) + 1];

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
				for (const i in lentilles.current) {
					const lentille = lentilles.current[i];

					const nextLentille = lentilles.current[Number(i) + 1];

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
									"A∞",
									canvasRef.current.width - size,
									endingY + size * 1.4,
								);
							}

							if (initialPos === Bpos) {
								ctx.fillText(
									"B∞",
									canvasRef.current.width - size,
									endingY - size * 0.9,
								);
							}
						}
					}
				}
			}

			if (!infiniteObject && rayons.delta.enabled && lentilles.current[0]) {
				setColor(ctx, rayons.delta.color);
				drawRayon(Bpos, { x: lentilles.current[0].pos, y: Bpos.y });
			}

			if (rayons.O.enabled && lentilles.current[0]) {
				setColor(ctx, rayons.O.color);
				drawRayon(Bpos, { x: lentilles.current[0].pos, y: originY });
			}

			if (rayons.F.enabled && lentilles.current[0]) {
				setColor(ctx, rayons.F.color);
				drawRayon(
					infiniteObject ? Apos : Bpos,
					lentilles.current[0].focalRayonHitPoint,
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
