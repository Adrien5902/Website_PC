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
import {
	type Direction,
	type Image,
	Lentille,
	Miroir,
	type System,
	type Moving,
	type Rayons,
} from "./types";

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

			const systems = [lentilles.current, miroirs.current].flat();

			for (const system of systems) {
				system.images = [];
			}

			const sortedSystems = systems.sort((a, b) => a.pos - b.pos);
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

			const rayonsEnabled = Object.values(rayons).filter(
				(r) => r.enabled,
			).length;

			function loopOverSystems(
				fn: (
					system: System,
					direction: Direction,
					nextSystem: System,
					i: number,
				) => void,
			) {
				let i = 0;
				let iterations = 0;
				let direction: Direction = 1;
				while (sortedSystems[i] && iterations < sortedSystems.length * 5) {
					const system = sortedSystems[i];
					direction = (direction * system.getOutputDirection()) as Direction;
					const nextSystem = sortedSystems[Number(i) + direction];
					fn(system, direction, nextSystem, i);
					i += direction;
					iterations++;
				}
			}

			function calcLinearY(A: Pos, B: Pos, x: number) {
				return ((B.y - A.y) / (B.x - A.x)) * (x - B.x) + B.y;
			}

			let lastPosA = Apos;
			let lastPosB = BPos;

			loopOverSystems((system, _direction, nextSystem, i) => {
				let image: Image;

				if (system instanceof Lentille) {
					const isFirstInf = infiniteObject && i === 0;
					const lastPos = isFirstInf ? lastPosA : lastPosB;

					const focalRayonHitPoint = {
						x: system.pos,
						y: calcLinearY(
							lastPos,
							{ x: system.pos - system.focalLength, y: originY },
							system.pos,
						),
					};

					const imagePos = {
						x:
							lastPosB.x +
							((system.pos - lastPosB.x) / (originY - lastPosB.y)) *
								(focalRayonHitPoint.y - lastPosB.y),
						y: focalRayonHitPoint.y,
					};

					image = {
						focalRayonHitPoint,
						pos: imagePos,
						virtual:
							(imagePos.x - system.pos) * system.getOutputDirection() < 0 ||
							(nextSystem && imagePos.x > nextSystem.pos),
					};

					system.gamma = (originY - imagePos.y) / (originY - lastPosB.y);
				} else if (system instanceof Miroir) {
					const imagePos = {
						x: 2 * system.pos - lastPosB.x,
						y: lastPosB.y,
					};
					image = {
						pos: imagePos,
						virtual:
							(imagePos.x - system.pos) * system.getOutputDirection() < 0,
					};
				} else {
					image = { pos: { x: 0, y: 0 }, virtual: true };
				}

				system.images.push(image);

				if (rayonsEnabled >= 2) {
					const _Apos: Pos = { x: image.pos.x, y: originY };
					setColor(ctx, "#FF0000");

					if (image.virtual) {
						drawDashedLine(ctx, _Apos, image.pos);
					} else {
						drawLine(ctx, _Apos, image.pos);
					}

					drawDot(ctx, _Apos);

					drawArrow(
						ctx,
						image.pos,
						image.pos.y > _Apos.y ? -Math.PI / 2 : Math.PI / 2,
						size,
					);

					ctx.fillText("A", _Apos.x + size / 3, originY + (size / 4) * 3);
					drawIndiceText(
						ctx,
						system.getSymbol() + system.id.toString(),
						{ x: _Apos.x + size * 0.9, y: originY + size },
						size,
					);
					ctx.fillText("B", image.pos.x + size / 3, image.pos.y + size / 3);
					drawIndiceText(
						ctx,
						system.getSymbol() + system.id.toString(),
						{
							x: image.pos.x + size * 0.9,
							y: image.pos.y + size * 0.6,
						},
						size,
					);
				}
				lastPosA = { x: image.pos.x, y: originY };
				lastPosB = image.pos;
			});

			for (const system of systems) {
				system.draw(ctx, size, moving, originY, isMouseNear, objectPos);
			}

			function drawRayon(initialPos: Pos, endingInitialPos: Pos) {
				function midPointArrow(A: Pos, B: Pos, direction: Direction) {
					const midPoint = {
						x: (A.x + B.x) / 2,
						y: (A.y + B.y) / 2,
					};

					drawArrow(
						ctx,
						midPoint,
						Math.atan((B.y - A.y) / (B.x - A.x)) +
							(direction >= 0 ? Math.PI : 0),
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
					midPointArrow(lastPos, initialPos, 1);
				}

				for (const system of sortedSystems) {
					system.currentImageNumber = 0;
				}

				loopOverSystems((system, direction, nextSystem) => {
					const image = system.images[system.currentImageNumber];

					if ((image.pos.x - system.pos) * direction < 0) {
						drawDashedLine(ctx, lastPos, image.pos);
					}

					if (nextSystem) {
						const nextSystemEndingY = calcLinearY(
							lastPos,
							image.pos,
							nextSystem.pos,
						);

						const nextPos = { x: nextSystem.pos, y: nextSystemEndingY };
						drawLine(ctx, lastPos, nextPos);
						midPointArrow(
							lastPos,
							{
								x: nextSystem.pos,
								y: nextSystemEndingY,
							},
							direction,
						);

						if (image.pos.x > nextPos.x) {
							drawDashedLine(ctx, nextPos, image.pos);
						}

						lastPos = nextPos;
					} else {
						const endingX = direction < 0 ? 0 : canvas.width;

						const endingY = calcLinearY(lastPos, image.pos, endingX);

						drawLine(ctx, lastPos, { x: endingX, y: endingY });

						midPointArrow(lastPos, { x: endingX, y: endingY }, direction);

						if (
							infiniteObject &&
							(image.pos.x > ctx.canvas.width || image.pos.x < 0)
						) {
							setColor(ctx, "#000000");
							if (initialPos === Apos) {
								ctx.fillText(
									"A'∞",
									ctx.canvas.width - size * 1.3,
									endingY + size * 1.4,
								);
							}

							if (initialPos === BPos) {
								ctx.fillText(
									"B'∞",
									ctx.canvas.width - size * 1.3,
									endingY - size * 0.9,
								);
							}
						}
					}
					system.currentImageNumber++;
				});
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
					sortedSystems[0].images[0].focalRayonHitPoint
				)
					drawRayon(
						infiniteObject ? Apos : BPos,
						sortedSystems[0].images[0].focalRayonHitPoint,
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
