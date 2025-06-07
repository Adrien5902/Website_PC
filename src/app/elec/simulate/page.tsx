"use client";
import { useEffect, useRef, useState } from "react";
import useFullscreen from "../../../hooks/Fullscreen";
//React Imports
import "./style.css";

import ComponentDrag from "@/types/elec/drag";
import { ComponentProperties } from "@/types/elec/properties";
//Elec imports
import {
	Circuit,
	type Component,
	ComponentSide,
	Connection,
	getElecImagePath,
	PowerSource,
	type Side,
} from "@/types/elec/types";

//Component types
import Générateur from "@/types/elec/Générateur";
import Interrupteur from "@/types/elec/Interrupteur";
import Lampe from "@/types/elec/Lampe";
import { Moteur } from "@/types/elec/Moteur";
import Multimetre from "@/types/elec/Multimetre";

//Canvas import
import {
	type Pos,
	drawDot,
	drawLine,
	getMousePos,
} from "../../../types/canvas";

import { faPlugCircleBolt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useCanvas from "../../../hooks/Canvas";

const componentTypes = [Générateur, Lampe, Interrupteur, Moteur, Multimetre];

function ElecSimulate() {
	const [cableMouse, setCableMouse] = useState(false);
	const [selectedSide, setSelectedSide] = useState<ComponentSide | null>(null);
	const app = useRef<HTMLDivElement>(null);
	const movingComponent = useRef<Component | null>(null);

	const [fullscreenButton] = useFullscreen(app);

	const circuit = useRef<Circuit>(Circuit.instance);

	const componentSizeRef = useRef<number>(128);

	const [idMax, setIdMax] = useState<number>(0);
	const frameRate = 60;

	const mousePosRef = useRef<Pos>({ x: 0, y: 0 });
	const canvasRef = useCanvas();

	function handleDrop(e: React.DragEvent<HTMLCanvasElement>) {
		if (!canvasRef.current) return;
		const pos = getMousePos(canvasRef.current, e);
		const type = e.dataTransfer.getData("text/plain");

		const componentType = componentTypes.find((t) => type === t.nom);

		if (componentType) {
			const component = new componentType(idMax, pos);

			circuit.current.components.push(component);
			setIdMax((prevId) => prevId + 1);
			setSelectedSide(new ComponentSide(component, 1));
		}

		canvasRef.current.classList.remove("draghover");
	}

	function selectComponent(mousePos: Pos): ComponentSide | null {
		const componentSize = componentSizeRef.current;
		let side = 0 as Side;
		const component = circuit.current.components.find((component) => {
			const x = mousePos.x - component.pos.x;
			const y = mousePos.y - component.pos.y;

			side = x > 0 ? 1 : -1;

			return Math.abs(x) < componentSize / 2 && Math.abs(y) < componentSize / 2;
		});

		return component ? new ComponentSide(component, side) : null;
	}

	function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
		if (!canvasRef.current) return;
		const mousePos = getMousePos(canvasRef.current, e);
		const componentSide = selectComponent(mousePos);

		setSelectedSide(componentSide);
		movingComponent.current = componentSide?.component ?? null;

		if (movingComponent.current && !cableMouse) {
			movingComponent.current.pos = mousePos;
		}
	}

	function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
		if (!canvasRef.current || !movingComponent.current) return;
		const componentBSide = selectComponent(getMousePos(canvasRef.current, e));

		const isMovingCable =
			cableMouse && movingComponent.current && selectedSide?.side;

		if (isMovingCable) {
			if (
				componentBSide &&
				componentBSide.component.id !== movingComponent.current.id
			) {
				const a = new ComponentSide(movingComponent.current, selectedSide.side);
				const b = componentBSide;

				circuit.current.connections.push(new Connection(a, b));
			}
		}

		movingComponent.current = null;
	}

	function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
		if (!canvasRef.current) return;
		const mousePos = getMousePos(canvasRef.current, e);
		mousePosRef.current = mousePos;

		if (movingComponent.current && !cableMouse) {
			movingComponent.current.pos = mousePos;
		}
	}

	function drawCanvas(
		canvas: React.MutableRefObject<HTMLCanvasElement | null>,
		mousePos: React.MutableRefObject<Pos>,
		componentSize: React.MutableRefObject<number>,
	) {
		const ctx = canvas.current?.getContext("2d");
		if (!(canvasRef.current && ctx)) return;

		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		ctx.font = `${componentSize.current / 3}px sans-serif`;
		ctx.lineWidth = componentSize.current / 12;

		if (cableMouse) {
			const componentSide = selectComponent(mousePos.current);
			if (componentSide) {
				const sidePos = componentSide.getPos(componentSize.current);
				drawDot(ctx, sidePos);
			}

			if (movingComponent && selectedSide?.side) {
				const sidePos = selectedSide.getPos(componentSize.current);
				drawDot(ctx, sidePos);
				drawLine(ctx, sidePos, mousePos.current);
			}
		}

		circuit.current.draw(ctx, componentSize.current);
	}

	useEffect(() => {
		const newCircuit = new Circuit();
		Circuit.instance = newCircuit;
		circuit.current = newCircuit;
		const intervalId = setInterval(() => {
			drawCanvas(canvasRef, mousePosRef, componentSizeRef);
		}, 1000 / frameRate);

		return () => clearInterval(intervalId);
	}, []);

	const nameInput = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (nameInput.current && selectedSide) {
			nameInput.current.value = selectedSide.component.name;
		}
	}, [selectedSide]);

	return (
		<>
			<div id="app" className={cableMouse ? "cable" : ""} ref={app}>
				<h1 style={{ width: "90vw" }} className="align-between">
					<div />
					<span>
						<FontAwesomeIcon icon={faPlugCircleBolt} /> Simulation de circuit
						électriques
					</span>
					<span>{fullscreenButton}</span>
				</h1>

				<div id="app-main">
					<div id="workspace">
						<div id="components" className="shadow-box">
							<div className="componentBox">
								<img
									alt="Cable"
									src={getElecImagePath("cable")}
									className={cableMouse ? "cable" : ""}
									onClick={() => setCableMouse((cable) => !cable)}
									draggable="false"
								/>
								<span>Câble</span>
							</div>
							{componentTypes.map((type, i) => (
								<ComponentDrag
									img={type.prototype.getDefaultImage()}
									name={type.nom}
									key={i}
								/>
							))}
						</div>

						<canvas
							id="result"
							ref={canvasRef}
							onDrop={handleDrop}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
							className="shadow-box"
						/>
					</div>

					<ComponentProperties
						c={selectedSide}
						components={circuit.current.components}
						conns={circuit.current.connections}
						sizeRef={componentSizeRef}
					/>
				</div>
			</div>
		</>
	);
}

export default ElecSimulate;
