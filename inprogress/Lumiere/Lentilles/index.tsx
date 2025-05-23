import "./style.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import useFullscreen from "../../../src/hooks/Fullscreen";
import type { Pos } from "../../../src/types/canvas";
import { type LentilleCanvasRef, LentillesCanvas } from "./LentillesCanvas";
import LentilleControls, {
	type LentilleControlsRef,
} from "./LentillesControls";

export class Rayon {
	label: string;
	id: string;
	color: string;
	enabled: boolean;

	constructor(id: string, label: string, color: string) {
		this.id = id;
		this.label = label;
		this.color = color;
		this.enabled = true;
	}
}

export class Lentille {
	pos: number;
	focalLength: number;
	imagePoint?: Pos;
	virtualImage?: boolean;
	focalRayonHitPoint?: Pos;
	gamma: number;
	id: number;

	constructor(id: number, pos: number, focalLength: number) {
		this.id = id;
		this.pos = pos;
		this.focalLength = focalLength;
	}
}

export interface Rayons {
	delta: Rayon;
	O: Rayon;
	F: Rayon;
	others: Rayon[];
}

export default function Lentilles() {
	const fullscreenAble = useRef<HTMLDivElement>(null);
	const [fullscreenButton] = useFullscreen(fullscreenAble);

	const objectPos = useRef<Pos>({ x: 0, y: 0 }); //X is the pos on delta axis, Y is the object height

	const moving = useRef<{
		type: "focalLength" | "object";
		object: Lentille | null;
	} | null>(null);

	const [infiniteObject, setInfiniteObject] = useState(false);
	const infiniteObjectAngle = useRef(0.3);

	const lentilles = useRef<Lentille[]>([]);

	const rayons = useRef<Rayons>({
		delta: new Rayon("rΔ", "Rayon parallèle à Δ", "#FF00FF"),
		O: new Rayon(
			"rO",
			"Rayon passant par le centre de la lentille O",
			"#00FF00",
		),
		F: new Rayon("rF", "Rayon passant par le foyer F", "#00AAFF"),
		others: [],
	});

	function handleMouseUp() {
		moving.current = null;
	}

	const canvas = useRef<LentilleCanvasRef>(null);
	const controls = useRef<LentilleControlsRef>(null);

	return (
		<div
			ref={fullscreenAble}
			onTouchEnd={handleMouseUp}
			onMouseUp={handleMouseUp}
		>
			<div id="lentilles-app">
				<h1 style={{ width: "90vw" }} className="align-between">
					<div />
					<span>
						<FontAwesomeIcon icon={faMagnifyingGlass} /> Lentilles
					</span>
					<span>{fullscreenButton}</span>
				</h1>

				<div>
					<LentillesCanvas
						ref={canvas}
						{...{
							infiniteObject,
							infiniteObjectAngle,
							lentilles,
							moving,
							objectPos,
						}}
						rayons={rayons.current}
						controlsRef={controls}
					/>
					<LentilleControls
						ref={controls}
						{...{
							infiniteObjectAngle,
							lentilles,
							objectPos,
							rayons,
							setInfiniteObject,
						}}
						canvasRef={canvas}
					/>
				</div>
			</div>
		</div>
	);
}
