import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useCanvas from "../../../hooks/Canvas";
import useFullscreen from "../../../hooks/Fullscreen";
import {
	type Pos,
	drawDashedLine,
	drawDot,
	drawLine,
	getMousePos,
	setColor,
} from "../../../types/canvas";
import "./style.css";

class Rayon {
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

export default function Lentilles() {
	const size = 80;
	const arrowSize = size / 2;

	const fullscreenAble = useRef<HTMLDivElement>(null);
	const [fullscreenButton] = useFullscreen(fullscreenAble);
	const mousePosRef = useRef<Pos>({ x: 0, y: 0 });
	const originPos = useRef<Pos>({ x: 0, y: 0 });
	const object = useRef<Pos>({ x: 0, y: 0 }); //X is the pos on delta axis, Y is the object height
	const focalLength = useRef<number>(0);
	const [gamma, setGamma] = useState(0);
	const _object = useRef<Pos>(null);

	const objectPos = useRef<HTMLInputElement>(null);
	const objectHeight = useRef<HTMLInputElement>(null);
	const focalLengthRef = useRef<HTMLInputElement>(null);

	const moving = useRef<React.MutableRefObject<Pos | number>>(null);

	const [rayons] = useState<Rayon[]>([
		new Rayon("rΔ", "Rayon passant parrallèle à Δ", "#FF00FF"),
		new Rayon("rO", "Rayon passant par le centre de la lentille O", "#00FF00"),
		new Rayon("rF", "Rayon passant par le foyer F", "#00AAFF"),
	]);

	const canvasRef = useCanvas((size) => {
		originPos.current = { x: size.x / 2, y: size.y / 2 };

		drawCanvas(canvasRef.current);
	});

	function handleMouseMove(e) {
		mousePosRef.current = getMousePos(canvasRef.current, e);

		if (moving.current) {
			switch (moving.current) {
				case object:
					object.current.x = mousePosRef.current.x - originPos.current.x;
					object.current.y = originPos.current.y - mousePosRef.current.y;
					objectPos.current.value = String(object.current.x.toFixed(0));
					objectHeight.current.value = String(object.current.y.toFixed(0));
					break;

				case focalLength:
					focalLength.current = originPos.current.x - mousePosRef.current.x;
					focalLengthRef.current.value = String(focalLength.current.toFixed(0));
					break;

				default:
					moving.current.current = mousePosRef.current;
					break;
			}
		}

		drawCanvas(canvasRef.current);
	}

	function handleMouseDown() {
		if (
			isMouseNear({
				x: originPos.current.x + object.current.x,
				y: originPos.current.y - object.current.y,
			})
		) {
			moving.current = object;
		}

		if (
			isMouseNear({
				x: originPos.current.x - focalLength.current,
				y: originPos.current.y,
			})
		) {
			moving.current = focalLength;
		}
	}

	function handleMouseUp() {
		moving.current = null;
	}

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

	function drawCanvas(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		setColor(ctx, "#FFF");
		ctx.font = `${(size / 5) * 4}px sans-serif`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		setColor(ctx, "#000");
		ctx.lineWidth = size / 12;

		const { x: originX, y: originY } = originPos.current;
		ctx.fillText("O", originX + size / 3, originY + size);

		const xStart = { x: size, y: originY };
		const xEnd = { x: canvas.width - size, y: originY };
		drawLine(ctx, xStart, xEnd);
		drawArrow(ctx, xEnd, "right");

		ctx.fillText("Δ", xEnd.x, xEnd.y + size);

		const Apos = { x: originX + object.current.x, y: originY };
		const Bpos: Pos = { x: Apos.x, y: originY - object.current.y };

		ctx.fillText("A", Apos.x, originY + size);
		ctx.fillText("B", Bpos.x + size / 3, Bpos.y);

		setColor(ctx, "#FF0000");

		drawDot(ctx, Apos, size / 10);

		drawLine(ctx, Apos, Bpos);
		drawArrow(ctx, Bpos, Bpos.y < Apos.y ? "up" : "down");

		if ((isMouseNear(Bpos) && !moving.current) || moving.current === object) {
			ctx.beginPath();
			ctx.arc(Bpos.x, Bpos.y, size / 2, 0, 360);
			ctx.stroke();
		}

		setColor(ctx, "#000");

		const Fpos = { x: originX - focalLength.current, y: originY };
		const _Fpos = { x: originX + focalLength.current, y: originY }; //_F = F'

		if (
			(isMouseNear(Fpos) && !moving.current) ||
			moving.current === focalLength
		) {
			ctx.beginPath();
			ctx.arc(Fpos.x, Fpos.y, size / 2, 0, 360);
			ctx.stroke();
		}

		drawLine(
			ctx,
			{ x: Fpos.x, y: Fpos.y - size / 5 },
			{ x: Fpos.x, y: Fpos.y + size / 5 },
		);
		ctx.fillText("F", Fpos.x, Fpos.y + size);
		drawLine(
			ctx,
			{ x: _Fpos.x, y: _Fpos.y - size / 5 },
			{ x: _Fpos.x, y: _Fpos.y + size / 5 },
		);
		ctx.fillText("F'", _Fpos.x, _Fpos.y + size);

		const m1 = (Fpos.y - Bpos.y) / (Fpos.x - Bpos.x);
		const p1 = Fpos.y - m1 * Fpos.x;
		const pF = originX * m1 + p1;

		const Osize = Math.max(Math.abs(object.current.y), Math.abs(originY - pF));

		const Otop = { x: originX, y: originY - Osize - size };
		const Obottom = { x: originX, y: originY + Osize + size };

		drawLine(ctx, Otop, Obottom);
		drawArrow(ctx, Otop, focalLength.current > 0 ? "up" : "down");
		drawArrow(ctx, Obottom, focalLength.current < 0 ? "up" : "down");

		const m = [];
		const p = [];

		const rdelta = rayons[0];
		if (rdelta.enabled) {
			setColor(ctx, rdelta.color);
			const mdelta = (_Fpos.y - Bpos.y) / (_Fpos.x - originX);
			const pdelta = _Fpos.y - mdelta * _Fpos.x;
			drawLine(ctx, Bpos, { x: originX, y: Bpos.y });
			drawLine(
				ctx,
				{ x: originX, y: Bpos.y },
				{ x: _Fpos.x * 10, y: _Fpos.x * 10 * mdelta + pdelta },
			);

			m.push(mdelta);
			p.push(pdelta);
		}

		let mO = null;
		let pO = null;
		const rO = rayons[1];
		if (rO.enabled) {
			setColor(ctx, rO.color);
			mO = (originY - Bpos.y) / (originX - Bpos.x);
			pO = Bpos.y - mO * Bpos.x;
			drawLine(ctx, Bpos, { x: originX * 2, y: mO * (originX * 2) + pO });

			m.push(mO);
			p.push(pO);
		}

		const rF = rayons[2];
		if (rF.enabled) {
			const mF = 0;

			setColor(ctx, rF.color);
			drawLine(ctx, Bpos, { x: originX, y: originX * m1 + p1 });
			drawLine(ctx, { x: originX, y: pF }, { x: originX * 2, y: pF });

			m.push(mF);
			p.push(pF);
		}

		if (m.length >= 2 && p.length >= 2) {
			const _Bpos = { x: 0, y: 0 }; //_B = B'

			//m1 x + p1 = m2 x + p2
			//m1 x - m2 x = p2 - p1
			//x(m1 - m2) = p2 - p1
			//x = (p2 - p1)/(m1 - m2)
			_Bpos.x = (p[1] - p[0]) / (m[0] - m[1]);
			_Bpos.y = _Bpos.x * m[0] + p[0];

			const _Apos = { x: 0, y: 0 }; //_A = A'
			_Apos.x = _Bpos.x;
			_Apos.y = originY;

			_object.current = { x: _Apos.x - originX, y: originY - _Bpos.y };

			const gma = (_Bpos.y - _Apos.y) / (Bpos.y - Apos.y);

			if (gma > 0) {
				if (rdelta.enabled) {
					setColor(ctx, rdelta.color);
					drawDashedLine(ctx, { x: originX, y: Bpos.y }, _Bpos, size / 4);
				}

				if (rO.enabled) {
					setColor(ctx, rO.color);
					drawDashedLine(
						ctx,
						{ x: originX * 2, y: mO * (originX * 2) + pO },
						_Bpos,
						size / 4,
					);
				}

				if (rF.enabled) {
					setColor(ctx, rF.color);
					drawDashedLine(ctx, { x: originX, y: pF }, _Bpos, size / 4);
				}

				setColor(ctx, "#FF0000");

				drawDashedLine(ctx, _Apos, _Bpos, size / 4);
			} else {
				setColor(ctx, "#FF0000");
				drawLine(ctx, _Apos, _Bpos);
			}

			drawDot(ctx, _Apos);

			drawArrow(ctx, _Bpos, _Bpos.y > _Apos.y ? "down" : "up");
			ctx.fillText("A'", _Apos.x + size / 3, originY + (size / 4) * 3);
			ctx.fillText("B'", _Bpos.x + size / 3, _Bpos.y + size / 3);

			setGamma(gma);
		}
	}

	useEffect(() => {
		focalLength.current = originPos.current.x / 4;
		object.current.x = -originPos.current.x / 2;
		object.current.y = originPos.current.y / 2;

		objectPos.current.value = object.current.x.toFixed(0).toString();
		objectHeight.current.value = object.current.y.toFixed(0).toString();
		focalLengthRef.current.value = focalLength.current.toFixed(0).toString();

		drawCanvas(canvasRef.current);
	}, []);

	return (
		<div ref={fullscreenAble}>
			<h1 style={{ width: "90vw" }} className="align-between">
				<div />
				<span>
					<FontAwesomeIcon icon={faMagnifyingGlass} /> Lentilles
				</span>
				<span>{fullscreenButton}</span>
			</h1>

			<div id="lentilles-app">
				<canvas
					id="lentilles-canvas"
					className="shadow-box"
					ref={canvasRef}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseDown={handleMouseDown}
				/>

				<div className="shadow-box" id="lentilles-inputs">
					<div id="lentilles-rayons">
						{rayons.map((rayon, i) => (
							<div
								className="rayon-input"
								style={{ userSelect: "none" }}
								key={i}
							>
								<input
									type="color"
									defaultValue={rayon.color}
									onChange={(e) => {
										rayon.color = e.target.value;
										drawCanvas(canvasRef.current);
									}}
								/>
								<input
									type="checkbox"
									id={rayon.id}
									defaultChecked={rayon.enabled}
									onChange={(e) => {
										rayon.enabled = e.target.checked;
										drawCanvas(canvasRef.current);
									}}
								/>
								<label htmlFor={rayon.id}>{rayon.label}</label>
							</div>
						))}
					</div>

					<div>
						<span>
							γ (gamma, grandissment) = {gamma ? gamma.toFixed(2) : 0}
						</span>
						<span>
							A'B' (taille de l'image) ={" "}
							{_object.current ? _object.current.y.toFixed(2) : "Pas d'image"}
						</span>
						<span>
							OA' (distance entre la lentille et l'image) ={" "}
							{_object.current ? _object.current.x.toFixed(2) : "Pas d'image"}
						</span>

						<div>
							<span>AB (taille de l'objet) : </span>
							<input
								type="number"
								ref={objectHeight}
								onChange={(e) => {
									object.current.y = Number(e.target.value);
									drawCanvas(canvasRef.current);
								}}
							/>
						</div>

						<div>
							<span>OA (distance de l'objet) : </span>
							<input
								type="number"
								ref={objectPos}
								onChange={(e) => {
									object.current.x = Number(e.target.value);
									drawCanvas(canvasRef.current);
								}}
							/>
						</div>

						<div>
							<span>f' (distance focale) : </span>
							<input
								type="number"
								ref={focalLengthRef}
								onChange={(e) => {
									focalLength.current = Number(e.target.value);
									drawCanvas(canvasRef.current);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
