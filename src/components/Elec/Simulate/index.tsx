import { useEffect, useRef, useState } from "react";
import useFullscreen from "../../../hooks/Fullscreen";
//React Imports
import "./style.css";

import { Circuit } from "./components/circuit";
import ComponentDrag from "./components/drag";
import { ComponentProperties } from "./components/properties";
//Elec imports
import {
	type Component,
	ComponentSide,
	Connection,
	type PowerSource,
	type Side,
} from "./components/types";

//Component types
import Générateur from "./components/Générateur";
import Interupteur from "./components/Interrupteur";
import Lampe from "./components/Lampe";
import Pile from "./components/Pile";

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
import { Moteur } from "./components/Moteur";
//Img import
import cableImg from "./img/cable.png";

const componentTypes = [Générateur, Lampe, Interupteur, Pile, Moteur];

function ElecSimulate() {
	const [cableMouse, setCableMouse] = useState(false);
	const [selectedSide, setSelectedSide] = useState<ComponentSide>(null);
	const app = useRef(null);
	const movingComponent = useRef<Component>(null);

	const [fullscreenButton] = useFullscreen(app);

	const components = useRef<Component[]>([]);
	const connections = useRef<Connection[]>([]);

	const componentSizeRef = useRef<number>(128);

	const [idMax, setIdMax] = useState<number>(0);
	const frameRate = 60;

	const mousePosRef = useRef<Pos>({ x: 0, y: 0 });
	const canvasRef = useCanvas();

	const getConnections = (c: Component): Connection[] =>
		connections.current.filter(
			(con) => con.a.component === c || con.b.component === c,
		);

	function handleDrop(e) {
		const pos = getMousePos(canvasRef.current, e);
		const type = e.dataTransfer.getData("text/plain");

		const componentType = componentTypes.find((t) => type === t.nom);

		if (componentType) {
			const component = new componentType(idMax, pos);

			components.current.push(component);
			setIdMax((prevId) => prevId + 1);
			setSelectedSide(new ComponentSide(component, 0));
		}

		canvasRef.current.classList.remove("draghover");
	}

	function selectComponent(mousePos: Pos): ComponentSide {
		const componentSize = componentSizeRef.current;
		let side = 0 as Side;
		const component = components.current.find((component) => {
			const x = mousePos.x - component.pos.x;
			const y = mousePos.y - component.pos.y;

			side = x > 0 ? 1 : -1;

			return Math.abs(x) < componentSize / 2 && Math.abs(y) < componentSize / 2;
		});

		return component ? new ComponentSide(component, side) : null;
	}

	function handleMouseDown(e) {
		const mousePos = getMousePos(canvasRef.current, e);
		const componentSide = selectComponent(mousePos);

		setSelectedSide(componentSide);
		movingComponent.current = componentSide?.component;

		if (movingComponent.current && !cableMouse) {
			movingComponent.current.pos = mousePos;
		}
	}

	function handleMouseUp(e) {
		const componentBSide = selectComponent(getMousePos(canvasRef.current, e));

		const isMovingCable =
			cableMouse && movingComponent.current && selectedSide.side;

		if (isMovingCable) {
			if (
				componentBSide &&
				componentBSide.component.id !== movingComponent.current.id
			) {
				const a = new ComponentSide(movingComponent.current, selectedSide.side);
				const b = componentBSide;

				connections.current.push(new Connection(a, b));
			}
		}

		movingComponent.current = null;
	}

	function handleMouseMove(e) {
		const mousePos = getMousePos(canvasRef.current, e);
		mousePosRef.current = mousePos;

		if (movingComponent.current && !cableMouse) {
			movingComponent.current.pos = mousePos;
		}
	}

	function drawCanvas(
		canvas: HTMLCanvasElement,
		mousePos: Pos,
		componentSize: number,
	) {
		const ctx = canvas.getContext("2d");
		if (canvasRef.current) {
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			ctx.font = `${componentSize / 3}px sans-serif`;
			ctx.lineWidth = componentSize / 12;

			for (const component of components.current) {
				if ("I" in component) {
					component.I = 0;
				}
			}

			for (const c of components.current.filter((c) => "getVoltage" in c)) {
				const powerSource: PowerSource = c as PowerSource;
				const connexions = getConnections(powerSource).filter(
					(c) =>
						(c.a.component.id === powerSource.id && c.a.side === 1) ||
						(c.b.component.id === powerSource.id && c.b.side === 1),
				);

				for (const firstConn of connexions) {
					const conns: Connection[] = [];

					let conn: Connection = firstConn;
					let component: Component = powerSource;
					let broke = false;
					let i = 0;

					while (conn && !broke) {
						const { component: c, side } =
							conn.a.component.id === component.id ? conn.b : conn.a;
						component = c;

						if ("opened" in component) broke = component.opened as boolean;

						const nextSide = side * -1;
						conn = connections.current.find((c) => {
							if (c.a.component === component) {
								return c.a.side === nextSide;
							}
							if (c.b.component === component) {
								return c.b.side === nextSide;
							}
							return false;
						});

						if (!conn) {
							broke = true;
						} else {
							conns.push(conn);
						}

						i++;

						if (conn === firstConn || i > 100) {
							break;
						}
					}

					if (!broke && conns.length) {
						broke = !(
							conns[conns.length - 1]
								.getComponents()
								.findIndex((m) => m.id === powerSource.id) !== -1
						);
					}

					if (!broke) {
						Circuit(conns);
					}
				}
			}

			for (const component of components.current) {
				component.draw(ctx, componentSize);
			}

			for (const c of connections.current) {
				const sidePosA = c.a.getPos(componentSize);
				const sidePosB = c.b.getPos(componentSize);
				drawDot(ctx, sidePosA);
				drawDot(ctx, sidePosB);
				c.draw(ctx, componentSize);
			}

			if (cableMouse) {
				const componentSide = selectComponent(mousePos);
				if (componentSide) {
					const sidePos = componentSide.getPos(componentSize);
					drawDot(ctx, sidePos);
				}

				if (movingComponent.current && selectedSide.side) {
					const sidePos = selectedSide.getPos(componentSize);
					drawDot(ctx, sidePos);
					drawLine(ctx, sidePos, mousePos);
				}
			}
		}
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			drawCanvas(
				canvasRef.current,
				mousePosRef.current,
				componentSizeRef.current,
			);
		}, 1000 / frameRate);

		return () => clearInterval(intervalId);
	}, [components, mousePosRef.current, componentSizeRef.current]);

	const nameInput = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (nameInput.current) {
			nameInput.current.value = selectedSide?.component.name;
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
									src={cableImg}
									className={cableMouse ? "cable" : ""}
									onClick={() => setCableMouse((cable) => !cable)}
									draggable="false"
								/>
								<span>Câble</span>
							</div>
							{componentTypes.map((type, i) => (
								<ComponentDrag
									img={type.defaultImage}
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
						components={components}
						conns={connections}
						sizeRef={componentSizeRef}
					/>
				</div>
			</div>
		</>
	);
}

export default ElecSimulate;
