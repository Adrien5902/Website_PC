"use client";
import {
	faFillDrip,
	faMinusCircle,
	faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import "./style.css";
import useCanvas from "@/hooks/Canvas";
import { getMousePos, type Pos } from "@/types/canvas";

type Sythese = "additive" | "soustractive";

const radiusCoef = 1 / 8;

interface Circle extends Pos {
	color: string;
	alpha: number;
}

interface Moving extends Pos {
	circle: Circle;
	canvas: HTMLCanvasElement;
}

interface SytheseProps {
	colors: string[];
	sythese: Sythese;
	moving: React.MutableRefObject<Moving | null>;
}

function SytheseElement({ colors, sythese, moving }: SytheseProps) {
	let radius = 150;

	const circles = colors.reduce(
		(prev, curr) => [
			...prev,
			{
				x: 0,
				y: 0,
				alpha: 1,
				color: curr,
			},
		],
		[] as Circle[],
	);

	const canvasRef = useCanvas(onResize);

	function drawCanvas() {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx) return;
		ctx.reset();
		ctx.fillStyle = "white";

		ctx.globalCompositeOperation =
			sythese === "soustractive" ? "multiply" : "screen";

		for (const circle of circles) {
			ctx.globalAlpha = circle.alpha;
			ctx.fillStyle = circle.color;
			ctx.beginPath();
			ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function onResize(size: Pos) {
		radius = size.x * radiusCoef;
		drawCanvas();
	}

	useEffect(() => {
		if (!canvasRef.current) return;
		const { width: x, height: y } = canvasRef.current;
		circles.forEach((c, i) => {
			c.x = (x / 3) * (i + 0.5);
			c.y = y / 2;
		});
		onResize({ x, y });
	}, []);

	function handleMove(e: React.MouseEvent | React.TouchEvent) {
		if (moving.current) {
			const { canvas, circle, x, y } = moving.current;
			const pos = getMousePos(canvas, e);
			canvas.style.cursor = "grabbing";
			circle.x = pos.x - x;
			circle.y = pos.y - y;
			drawCanvas();
		} else {
			const canvas = (e.target as HTMLElement).closest("canvas");
			if (!canvas) return;
			const pos = getMousePos(canvas, e);
			const canMove = circles
				.map((circle) => {
					const x = pos.x - circle.x;
					const y = pos.y - circle.y;

					return { circle, dist: Math.sqrt(x ** 2 + y ** 2), x, y };
				})
				.filter((v) => v.dist <= radius).length;
			if (canvas) canvas.style.cursor = canMove ? "grab" : "auto";
		}
	}

	function mouseDown(evt: React.MouseEvent | React.TouchEvent) {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const mousePos = getMousePos(canvas, evt);

		const checkMovingCicles = circles
			.map((circle) => {
				const x = mousePos.x - circle.x;
				const y = mousePos.y - circle.y;

				return { circle, dist: Math.sqrt(x ** 2 + y ** 2), x, y };
			})
			.filter((v) => v.dist <= radius)
			.sort((a, b) => a.dist - b.dist);

		if (checkMovingCicles[0]) {
			const { circle, x, y } = checkMovingCicles[0];
			moving.current = { circle, canvas, x, y };
		}
	}

	return (
		<div className="sythese-couleur shadow-box">
			<div className="sythese-label">
				<h3>
					<FontAwesomeIcon icon={faFillDrip} /> Synthèse des couleurs {sythese}{" "}
					<FontAwesomeIcon
						icon={sythese === "additive" ? faPlusCircle : faMinusCircle}
					/>{" "}
					:
				</h3>
				<div>
					{colors.map((color, i) => (
						<div className="alpha-slider" key={i}>
							<div style={{ background: color }} className="round-label" />
							<input
								type="range"
								min={0}
								max={1}
								step={0.025}
								defaultValue={1}
								onChange={(e) => {
									const circle = circles.find((c) => c.color === color);
									if (circle) circle.alpha = Number(e.target.value);
									drawCanvas();
								}}
							/>
						</div>
					))}
				</div>
			</div>
			<canvas
				id="sythese"
				onMouseMove={handleMove}
				onMouseDown={mouseDown}
				onTouchMove={handleMove}
				onTouchStart={mouseDown}
				ref={canvasRef}
				style={{ background: sythese === "additive" ? "#000" : "#FFF" }}
			/>
		</div>
	);
}

export default function SpectreCouleur() {
	const moving = useRef<Moving | null>(null);

	function handleMouseUp() {
		if (moving.current) moving.current.canvas.style.cursor = "";
		moving.current = null;
	}

	return (
		<div onMouseUp={handleMouseUp} id="sythese-couleurs">
			<SytheseElement
				moving={moving}
				colors={["#F00", "#0F0", "#00F"]}
				sythese="additive"
			/>
			<SytheseElement
				moving={moving}
				colors={["#FF0", "#0FF", "#F0F"]}
				sythese="soustractive"
			/>
		</div>
	);
}
