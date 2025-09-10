"use client";

import {
	forwardRef,
	type MouseEvent,
	type TouchEvent,
	useImperativeHandle,
	useRef,
} from "react";
import {
	type Pos,
	drawLine,
	setColor,
	drawDot,
	drawDashedLine,
	getMousePos,
	drawIndiceText,
	drawArrow,
} from "@/types/canvas";
import useCanvas from "@/hooks/Canvas";
import type { LentilleControlsRef } from "./LentillesControls";
import { Lentille, Miroir, type Moving, type Rayons } from "./types";

interface Props {
	miroirs: React.MutableRefObject<Miroir[]>;
	lentilles: React.MutableRefObject<Lentille[]>;
	objectPos: React.MutableRefObject<Pos>;
	moving: Moving;
	rayons: Rayons;
	controlsRef: React.RefObject<LentilleControlsRef>;
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
			miroirs,
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
			width: canvasRef.current?.width ?? 0,
			height: canvasRef.current?.height ?? 0,
			size,
		}));

		const size = 80;
		const mousePosRef = useRef<Pos>({ x: 0, y: 0 });

		const canvasRef = useCanvas(
			(_canvasSize) => {
				originY = canvasRef.current ? canvasRef.current.height / 2 : size;
				drawCanvas();
			},
			() => {
				if (!lentilles.current.length) {
					objectPos.current = {
						x: size,
						y: (canvasRef.current?.height ?? 0) / 4,
					};
					lentilles.current = [
						new Lentille(1, (canvasRef.current?.width ?? 0) / 2, size * 4),
					];
				}
			},
		);

		let originY = canvasRef.current ? canvasRef.current.height / 2 : size;

		const isMouseNear = (pos: Pos) =>
			Math.abs(mousePosRef.current.x - pos.x) < size / 2 &&
			Math.abs(mousePosRef.current.y - pos.y) < size / 2;

		function drawCanvas() {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
			setColor(ctx, "#FFF");
			ctx.font = `${(size / 5) * 4}px sans-serif`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			setColor(ctx, "#000");
			ctx.lineWidth = size / 12;

			const xStart = { x: size, y: originY };
			const xEnd = { x: canvas.width - size, y: originY };
			drawLine(ctx, xStart, xEnd);
			drawArrow(ctx, xEnd, Math.PI, size);

			ctx.fillText("Δ", xEnd.x, xEnd.y + size);

			function calculateInfinitePointObjectPos(
				XPos: number,
				angle: number,
			): Pos & { sign: number } {
				const canvasHeight = canvas?.height ?? 0;
				const Height = originY - XPos * Math.tan(angle);

				const sign = Height > canvasHeight ? -1 : 1;

				const X = XPos - (originY * sign) / Math.tan(angle);

				return {
					x: Height > canvasHeight ? X : Height > 0 ? 0 : X,
					y: Height > canvasHeight ? canvasHeight : Height > 0 ? Height : 0,
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

			const sortedSystems = [lentilles.current, miroirs.current]
				.flat()
				.sort((a, b) => a.pos - b.pos);
			const firstObjectVirtual =
				sortedSystems[0] && sortedSystems[0].pos < Apos.x;

			if (!infiniteObject) {
				setColor(ctx, "#FF0000");

				drawDot(ctx, Apos, size / 10);

				if (firstObjectVirtual) {
					drawDashedLine(ctx, Apos, BPos);
				} else {
					drawLine(ctx, Apos, BPos);
				}

				drawArrow(
					ctx,
					BPos,
					BPos.y < Apos.y ? Math.PI / 2 : -Math.PI / 2,
					size,
				);

				if (
					(isMouseNear(BPos) && !moving.current) ||
					moving.current?.object === null
				) {
					ctx.beginPath();
					ctx.arc(BPos.x, BPos.y, size / 2, 0, 360);
					ctx.stroke();
				}
			}

			for (const system of sortedSystems) {
				system.draw(ctx, size, moving, originY, isMouseNear, objectPos);
			}

			const rayonsEnabled = Object.values(rayons).filter(
				(r) => r.enabled,
			).length;

			let lastPosA = Apos;
			let lastPosB = BPos;

			for (const i in sortedSystems) {
				const nextSystem = sortedSystems[Number(i) + 1];
				const system = sortedSystems[i];

				if (system instanceof Lentille) {
					system.focalRayonHitPoint = {
						x: system.pos,
						y:
							((originY -
								(infiniteObject && i === "0" ? lastPosA : lastPosB).y) /
								(system.pos -
									system.focalLength -
									(infiniteObject && i === "0" ? lastPosA : lastPosB).x)) *
								(system.pos -
									(infiniteObject && i === "0" ? lastPosA : lastPosB).x) +
							(infiniteObject && i === "0" ? lastPosA : lastPosB).y,
					};

					system.imagePoint = {
						x:
							lastPosB.x +
							((system.pos - lastPosB.x) / (originY - lastPosB.y)) *
								(system.focalRayonHitPoint.y - lastPosB.y),
						y: system.focalRayonHitPoint.y,
					};

					system.gamma =
						(originY - system.imagePoint.y) / (originY - lastPosB.y);

					system.virtualImage =
						system.imagePoint.x < system.pos ||
						(nextSystem && system.imagePoint.x > nextSystem.pos);
				}

				if (rayonsEnabled >= 2) {
					const _Apos: Pos = { x: system.imagePoint.x, y: originY };
					setColor(ctx, "#FF0000");

					if (system.virtualImage) {
						drawDashedLine(ctx, _Apos, system.imagePoint);
					} else {
						drawLine(ctx, _Apos, system.imagePoint);
					}

					drawDot(ctx, _Apos);

					drawArrow(
						ctx,
						system.imagePoint,
						system.imagePoint.y > _Apos.y ? -Math.PI / 2 : Math.PI / 2,
						size,
					);

					ctx.fillText("A", _Apos.x + size / 3, originY + (size / 4) * 3);
					drawIndiceText(
						ctx,
						system.id.toString(),
						{ x: _Apos.x + size * 0.9, y: originY + size },
						size,
					);
					ctx.fillText(
						"B ",
						system.imagePoint.x + size / 3,
						system.imagePoint.y + size / 3,
					);
					drawIndiceText(
						ctx,
						system.id.toString(),
						{
							x: system.imagePoint.x + size * 0.9,
							y: system.imagePoint.y + size * 0.6,
						},
						size,
					);
				}

				lastPosA = { x: system.imagePoint.x, y: originY };
				lastPosB = system.imagePoint;
			}

			function drawRayon(initialPos: Pos, endingInitialPos: Pos) {
				function calcLinearY(A: Pos, B: Pos, x: number) {
					return ((B.y - A.y) / (B.x - A.x)) * (x - B.x) + B.y;
				}

				function midPointArrow(A: Pos, B: Pos) {
					const midPointX = (A.x + B.x) / 2;
					const midPoint = {
						x: midPointX,
						y: calcLinearY(A, B, midPointX),
					};

					drawArrow(
						ctx,
						midPoint,
						(B.y - A.y) / (B.x - A.x) + Math.PI,
						size / 2,
					);
				}

				if (!canvas) return;
				let lastPos = endingInitialPos;

				const firstY = calcLinearY(lastPos, initialPos, 0);
				drawLine(ctx, { x: 0, y: firstY }, lastPos);

				if (firstObjectVirtual) {
					drawDashedLine(ctx, initialPos, lastPos);
				} else {
					drawLine(ctx, initialPos, lastPos);
					midPointArrow(lastPos, initialPos);
				}

				for (const i in sortedSystems) {
					const system = sortedSystems[i];

					const nextSystem = sortedSystems[Number(i) + 1];

					if (system.imagePoint.x < system.pos && system instanceof Lentille) {
						drawDashedLine(ctx, lastPos, system.imagePoint);
					}

					if (nextSystem) {
						const nextLentilleEndingY = calcLinearY(
							lastPos,
							system.imagePoint,
							nextSystem.pos,
						);

						const nextPos = { x: nextSystem.pos, y: nextLentilleEndingY };
						drawLine(ctx, lastPos, nextPos);
						midPointArrow(lastPos, {
							x: nextSystem.pos,
							y: nextLentilleEndingY,
						});

						if (system.imagePoint.x > nextPos.x) {
							drawDashedLine(ctx, nextPos, system.imagePoint);
						}

						lastPos = nextPos;
					} else {
						const endingY = calcLinearY(
							lastPos,
							system.imagePoint,
							canvas.width,
						);

						drawLine(ctx, lastPos, { x: canvas.width, y: endingY });

						midPointArrow(lastPos, { x: canvas.width, y: endingY });

						if (
							infiniteObject &&
							(system.imagePoint.x > canvasRef.current.width ||
								system.imagePoint.x < 0)
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

			if (!infiniteObject && rayons.delta.enabled && sortedSystems[0]) {
				setColor(ctx, rayons.delta.color);
				drawRayon(BPos, { x: sortedSystems[0].pos, y: BPos.y });
			}

			if (rayons.O.enabled && sortedSystems[0]) {
				setColor(ctx, rayons.O.color);
				drawRayon(BPos, { x: sortedSystems[0].pos, y: originY });
			}

			if (rayons.F.enabled && sortedSystems[0]) {
				setColor(ctx, rayons.F.color);
				if (
					sortedSystems[0] instanceof Lentille &&
					sortedSystems[0].focalRayonHitPoint
				)
					drawRayon(
						infiniteObject ? Apos : BPos,
						sortedSystems[0].focalRayonHitPoint,
					);
			}

			controlsRef.current?.refresh();
		}

		function handleMouseMove(e: MouseEvent | TouchEvent) {
			if (!canvasRef.current) return;
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
							if (moving.current.object instanceof Lentille)
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
				return;
			}

			for (const lentille of lentilles.current) {
				if (
					isMouseNear({
						x: lentille.pos + lentille.focalLength,
						y: originY,
					})
				) {
					moving.current = { object: lentille, type: "focalLength" };
					return;
				}

				if (
					isMouseNear({
						x: lentille.pos,
						y: originY,
					})
				) {
					moving.current = { object: lentille, type: "object" };
					return;
				}
			}

			for (const miroir of miroirs.current) {
				if (isMouseNear({ x: miroir.pos, y: originY })) {
					moving.current = { object: miroir, type: "object" };
					return;
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
