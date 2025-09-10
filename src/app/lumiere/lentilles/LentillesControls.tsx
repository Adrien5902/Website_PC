"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Lentille, Miroir, type Rayon, type Rayons } from "./types";
import type { LentilleCanvasRef } from "./LentillesCanvas";
import type { Pos } from "@/types/canvas";
import SectionSelector from "@/components/SectionSelector";
import { LentilleSettings } from "./LentilleSettings";
import { MiroirSettings } from "./MiroirSettings";

export interface Props {
	miroirs: React.MutableRefObject<Miroir[]>;
	lentilles: React.MutableRefObject<Lentille[]>;
	setInfiniteObject: React.Dispatch<React.SetStateAction<boolean>>;
	rayons: React.MutableRefObject<Rayons>;
	objectPos: React.MutableRefObject<Pos>;
	canvasRef: React.RefObject<LentilleCanvasRef>;
	infiniteObjectAngle: React.MutableRefObject<number>;
}

export interface LentilleControlsRef {
	refresh: () => void;
}

const LentilleControls = forwardRef<LentilleControlsRef, Props>(
	(
		{
			miroirs,
			lentilles,
			setInfiniteObject,
			rayons,
			objectPos,
			canvasRef,
			infiniteObjectAngle,
		},
		ref,
	) => {
		const [_r, setR] = useState(0);

		useImperativeHandle(ref, () => ({
			refresh: () => {
				setR((r) => r + 1);
			},
		}));

		return (
			<div>
				<div className="lentilles-controls">
					<SectionSelector
						id="lentilles-section-selector"
						onSelection={(selection) => {
							setInfiniteObject(selection !== "Objet Proche");
							canvasRef.current?.refresh();
						}}
						sections={[
							{
								label: "Objet Proche",
								content: (
									<div className="lentilles-data">
										<div>
											<div>
												<span>OA (position de l'objet) : </span>
												<input
													type="number"
													value={
														objectPos.current.x - (canvasRef.current?.size ?? 0)
													}
													onChange={(e) => {
														objectPos.current.x =
															Number(e.target.value) +
															(canvasRef.current?.size ?? 0);
														canvasRef.current?.refresh();
													}}
												/>
											</div>

											<div>
												<span>AB (taille de l'objet) : </span>
												<input
													type="number"
													value={objectPos.current.y}
													onChange={(e) => {
														objectPos.current.y = Number(e.target.value);
														canvasRef.current?.refresh();
													}}
												/>
											</div>
										</div>
										<div>
											{[
												rayons.current.F,
												rayons.current.O,
												rayons.current.delta,
											].map((rayon, i) => (
												<SpecialRayonInput
													key={i}
													canvasRef={canvasRef}
													rayon={rayon}
												/>
											))}
										</div>
									</div>
								),
							},
							{
								label: "Objet à l'infini",
								content: (
									<div className="lentilles-data">
										<div>
											<span>Angle des rayons (radians) : </span>
											<input
												type="number"
												onChange={(e) => {
													infiniteObjectAngle.current = Number(e.target.value);
													canvasRef.current?.refresh();
												}}
												value={infiniteObjectAngle.current}
											/>
										</div>

										<div>
											{[rayons.current.F, rayons.current.O].map((rayon, i) => (
												<SpecialRayonInput
													key={i}
													canvasRef={canvasRef}
													rayon={rayon}
												/>
											))}
										</div>
									</div>
								),
							},
							// {
							// 	label: "Rayons quelconques",
							// 	content: <div className="lentilles-data"></div>,
							// },
						]}
					/>

					{lentilles.current
						.sort((a, b) => a.id - b.id)
						.map((lentille, i) => (
							<LentilleSettings
								removeLentille={() => {
									lentilles.current.splice(i, 1);
									canvasRef.current?.refresh();
								}}
								canvasRef={canvasRef}
								key={lentille.id}
								lentille={lentille}
							/>
						))}

					{miroirs.current
						.sort((a, b) => a.id - b.id)
						.map((miroir, i) => (
							<MiroirSettings
								removeMiroir={() => {
									miroirs.current.splice(i, 1);
									canvasRef.current?.refresh();
								}}
								canvasRef={canvasRef}
								key={miroir.id}
								miroir={miroir}
							/>
						))}
				</div>

				<button
					type="button"
					onClick={() => {
						const lastLentille =
							lentilles.current[lentilles.current.length - 1];

						lentilles.current.push(
							new Lentille(
								(lastLentille?.id ?? lentilles.current.length) + 1,
								(canvasRef.current?.width ?? 200) / 2,
								(canvasRef.current?.size ?? 0) * 2,
							),
						);
						canvasRef.current?.refresh();
					}}
				>
					<FontAwesomeIcon icon={faPlus} /> Ajouter une lentille
				</button>

				<button
					type="button"
					onClick={() => {
						const lastMiroir = miroirs.current[miroirs.current.length - 1];

						miroirs.current.push(
							new Miroir(
								(lastMiroir?.id ?? lentilles.current.length) + 1,
								(canvasRef.current?.width ?? 200) / 2,
							),
						);
						canvasRef.current?.refresh();
					}}
				>
					<FontAwesomeIcon icon={faPlus} /> Ajouter un miroir
				</button>
			</div>
		);
	},
);
export default LentilleControls;

function SpecialRayonInput({
	rayon,
	canvasRef,
}: { canvasRef: Props["canvasRef"]; rayon: Rayon }) {
	return (
		<div className="rayon-input" style={{ userSelect: "none" }}>
			<input
				type="color"
				defaultValue={rayon.color}
				onChange={(e) => {
					rayon.color = e.target.value;
					canvasRef.current?.refresh();
				}}
			/>
			<input
				type="checkbox"
				id={rayon.id}
				defaultChecked={rayon.enabled}
				onChange={(e) => {
					rayon.enabled = e.target.checked;
					canvasRef.current?.refresh();
				}}
			/>
			<label htmlFor={rayon.id}>{rayon.label}</label>
		</div>
	);
}
