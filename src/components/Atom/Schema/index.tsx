import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import useCanvas from "../../../hooks/Canvas";
import { type Pos, drawDot, drawLine, setColor } from "../../../types/canvas";
import { ExperimentsContext } from "../../App";
import { type Bloc, couchesLimit } from "../funct";
import type { Isotope } from "../isotope";
import "./style.css";

interface Props {
	atome: Isotope;
}

export default function AtomeSchema({ atome }: Props) {
	const [size, setSize] = useState<number>(12);

	const sizeCoef = 2;
	const canvasRef = useCanvas(null, sizeCoef);

	let frameRate = 60;
	let lastFrameTime = performance.now();
	const targetFrameDuration = 1000 / frameRate;

	const angleRef = useRef<number>(0);
	const noyau = useRef<Noyau>(null);

	const [paused, setPaused] = useState(true);
	const pausedRef = useRef(false);
	const calledRef = useRef(false);

	const experiments = useContext(ExperimentsContext);

	class Nucléon {
		type: "proton" | "neutron";
		pos: Pos;

		constructor(type: "proton" | "neutron", pos: Pos) {
			this.type = type;
			this.pos = pos;
		}

		draw(ctx: CanvasRenderingContext2D) {
			const { x, y } = this.pos;
			const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.3);
			gradient.addColorStop(0, "white");
			gradient.addColorStop(1, this.type === "proton" ? "red" : "green");

			ctx.fillStyle = gradient;
			drawDot(ctx, this.pos, size * 1.3);
		}
	}

	class Noyau {
		data: Nucléon[];

		constructor(atome: Isotope) {
			let remainingProton = atome.Z;
			let remainingNeutron = atome.getN();

			const canvas = canvasRef.current;
			const { width, height } = canvas;
			const origin: Pos = { x: width / 2, y: height / 2 };

			this.data = [];
			const circleMax = Math.floor(Math.log2(atome.A + 4));
			for (let i = 0; i < atome.A; i++) {
				const circleIndex = Math.floor(Math.log2(i + 4));

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
				const radius =
					(canvas.width / 10) * (circleIndex / circleMax) - size * 2;
				const angle =
					(circleIndex === circleMax
						? i / (atome.A - i / 2 ** circleIndex)
						: i / 2 ** circleIndex) *
					Math.PI *
					2;

				this.data.push(
					new Nucléon(isProton ? "proton" : "neutron", {
						x: x + radius * Math.cos(angle),
						y: y + radius * Math.sin(angle),
					}),
				);
			}
		}

		draw(ctx: CanvasRenderingContext2D) {
			for (const n of this.data) {
				n.draw(ctx);
			}
		}
	}

	function drawCanvas() {
		const canvas = canvasRef.current;
		const { width, height } = canvas;
		const origin: Pos = { x: width / 2, y: height / 2 };
		const angle = angleRef.current;

		const ctx = canvas.getContext("2d");

		//Clear
		ctx.lineWidth = size / 3;
		ctx.clearRect(0, 0, width, height);

		setColor(ctx, "black");

		//Électrons
		Object.keys(atome.couches).forEach((souscouche, i) => {
			const electrons: number = atome.couches[souscouche];
			const period = Number(souscouche[0]);
			const sousCoucheId = souscouche[1] as Bloc;
			const sousCoucheIndex = Object.keys(couchesLimit).findIndex(
				(sc) => sc === sousCoucheId,
			);

			setColor(ctx, `hwb(${(period / atome.période) * 360} 0% 0%)`);

			ctx.beginPath();
			const radius =
				(canvas.width * (period + sousCoucheIndex / 4)) /
				(atome.période + 0.5) /
				sizeCoef;
			ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
			ctx.stroke();

			for (let e = electrons; e > 0; e--) {
				const eangle =
					(i % 2 === 0 ? 1 : -1) *
					(angle +
						Math.PI * 2 * (e / electrons) +
						(Math.PI * sousCoucheIndex) / 4);
				setColor(ctx, "blue");
				const ePos = {
					x: origin.x + radius * Math.cos(eangle),
					y: origin.y + radius * Math.sin(eangle),
				};
				drawDot(ctx, ePos, size);
				setColor(ctx, "white");
				drawLine(
					ctx,
					{ x: ePos.x - size / 2, y: ePos.y },
					{ x: ePos.x + size / 2, y: ePos.y },
				);
			}
		});

		//Noyau
		experiments && noyau.current?.draw(ctx);
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
