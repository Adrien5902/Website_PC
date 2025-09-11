import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useCanvas from "../../../hooks/Canvas";
import { type Pos, drawDot, drawLine, setColor } from "../../../types/canvas";
import { type Bloc, couchesLimit } from "../funct";
import type { Isotope } from "../isotope";
import "./style.css";

interface Props {
	atome: Isotope;
}

export default function AtomeSchema({ atome }: Props) {
	const [size, setSize] = useState<number>(12);

	const canvasRef = useCanvas(() => drawCanvas());

	let frameRate = 60;
	let lastFrameTime = performance.now();
	const targetFrameDuration = 1000 / frameRate;

	const angleRef = useRef<number>(0);
	const noyau = useRef<Noyau | null>(null);

	const [paused, setPaused] = useState(true);
	const pausedRef = useRef(false);
	const calledRef = useRef(false);

	class Nucléon {
		type: "proton" | "neutron";
		pos: Pos;

		constructor(type: "proton" | "neutron", pos: Pos) {
			this.type = type;
			this.pos = pos;
		}

		draw(ctx: CanvasRenderingContext2D) {
			const dotSize = size * 1.3;
			const signSize = dotSize * 0.5;

			const { x, y } = this.pos;
			const gradient = ctx.createRadialGradient(x, y, 0, x, y, dotSize);
			gradient.addColorStop(0, "white");
			gradient.addColorStop(1, this.type === "proton" ? "red" : "green");

			ctx.fillStyle = gradient;
			drawDot(ctx, this.pos, dotSize);

			if (this.type === "proton") {
				drawLine(ctx, { x: x - signSize, y }, { x: x + signSize, y });
				drawLine(ctx, { x, y: y - signSize }, { x, y: y + signSize });
			}
		}
	}

	class Noyau {
		data: Nucléon[];

		constructor(atome: Isotope) {
			let remainingProton = atome.Z;
			let remainingNeutron = atome.getN();

			const canvas = canvasRef.current;
			this.data = [];
			if (!canvas) return;
			const { width, height } = canvas;
			const origin: Pos = { x: width / 2, y: height / 2 };

			const circleMax = Math.ceil(Math.sqrt(atome.A / Math.PI));
			for (let i = 0; i < atome.A; i++) {
				const circleIndex = Math.ceil(Math.sqrt(i / Math.PI));

				let isProton = Math.random() - 0.5 > 0;

				if (isProton) {
					isProton = remainingProton > 0;
				} else {
					isProton = !(remainingNeutron > 0);
				}

				if (isProton) {
					remainingProton -= 1;
				} else {
					remainingNeutron -= 1;
				}

				const { x, y } = origin;
				const radius = circleIndex * size * 2;
				const angle =
					((i - (circleIndex - 1) ** 2 * Math.PI) /
						(circleIndex === circleMax
							? circleIndex * Math.PI * 2 -
								3 -
								atome.A +
								(circleIndex - 1) ** 2 * Math.PI
							: circleIndex * Math.PI * 2 - 3)) *
					Math.PI *
					2;

				this.data.push(
					new Nucléon(isProton ? "proton" : "neutron", {
						x: x + radius * Math.cos(Number.isFinite(angle) ? angle : 0),
						y: y + radius * Math.sin(Number.isFinite(angle) ? angle : 0),
					}),
				);
			}
		}

		draw(ctx: CanvasRenderingContext2D) {
			for (let i = atome.A - 1; i >= 0; i--) {
				this.data[i].draw(ctx);
			}
		}
	}

	function drawCanvas() {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const { width, height } = ctx.canvas;
		const origin: Pos = { x: width / 2, y: height / 2 };
		const angle = angleRef.current;

		//Clear
		ctx.lineWidth = size / 3;
		ctx.clearRect(0, 0, width, height);

		setColor(ctx, "black");

		//Électrons
		Object.keys(atome.couches).forEach((sousCouche, i) => {
			const electrons: number =
				atome.couches[sousCouche as keyof typeof atome.couches] ?? 1;
			const period = Number(sousCouche[0]);
			const sousCoucheId = sousCouche[1] as Bloc;
			const sousCoucheIndex = Object.keys(couchesLimit).findIndex(
				(sc) => sc === sousCoucheId,
			);

			setColor(ctx, `hwb(${(period / atome.période) * 360} 0% 0%)`);

			ctx.beginPath();
			const radius =
				canvas.height * ((period + sousCoucheIndex / 4) / atome.période / 3) +
				size * 16;
			ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
			ctx.stroke();

			setColor(ctx, "white");
			for (let e = electrons; e > 0; e--) {
				const eangle =
					(i % 2 === 0 ? 1 : -1) *
					(angle +
						Math.PI * 2 * (e / electrons) +
						(Math.PI * sousCoucheIndex) / 4);

				const ePos = {
					x: origin.x + radius * Math.cos(eangle),
					y: origin.y + radius * Math.sin(eangle),
				};
				const gradient = ctx.createRadialGradient(
					ePos.x,
					ePos.y,
					0,
					ePos.x,
					ePos.y,
					size,
				);
				gradient.addColorStop(0, "white");
				gradient.addColorStop(1, "blue");
				ctx.fillStyle = gradient;
				drawDot(ctx, ePos, size);
				ctx.fillStyle = "";
				drawLine(
					ctx,
					{ x: ePos.x - size / 2, y: ePos.y },
					{ x: ePos.x + size / 2, y: ePos.y },
				);
			}
		});

		//Noyau
		noyau.current?.draw(ctx);
	}

	function animate(currentTime: number) {
		const timeElapsed = currentTime - lastFrameTime;

		// If enough time has passed, draw the next frame
		if (timeElapsed >= targetFrameDuration) {
			if (!pausedRef.current) {
				drawCanvas();
				angleRef.current += timeElapsed / 1000; // Angle change based on real time
			}
			lastFrameTime = currentTime; // Reset last frame time
		}

		// Measure frame time and adjust frame rate if necessary
		if (timeElapsed > targetFrameDuration * 1.5) {
			frameRate = Math.max(10, frameRate - 5); // Decrease frame rate if frames take too long
		} else if (timeElapsed < targetFrameDuration * 0.5 && frameRate < 60) {
			frameRate += 5; // Increase frame rate if frames are rendering quickly
		}

		angleRef.current += 1 / (frameRate * 2);

		requestAnimationFrame(animate);
	}

	useEffect(() => {
		if (!calledRef.current) {
			if (!noyau.current) noyau.current = new Noyau(atome);
			requestAnimationFrame(animate);
			calledRef.current = true;
		}
		drawCanvas();
	}, []);

	useEffect(() => {
		pausedRef.current = paused;
	}, [paused]);

	return (
		<div>
			<p>
				<FontAwesomeIcon
					icon={paused ? faPlay : faPause}
					onClick={() => setPaused((p) => !p)}
					className="pause-button"
				/>
				<span>
					Schéma d'un atome de <sup>{atome.A}</sup>
					<sub>{atome.Z}</sub>
					{atome.symbol}
				</span>
			</p>
			<canvas
				ref={canvasRef}
				style={{ margin: "1em" }}
				id="isotope-schema-canvas"
			/>
		</div>
	);
}
