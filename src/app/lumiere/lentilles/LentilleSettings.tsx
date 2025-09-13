"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LentilleCanvasRef } from "./LentillesCanvas";
import type { Lentille } from "./types";

export function LentilleSettings({
	lentille,
	canvasRef,
	removeLentille,
}: {
	lentille: Lentille;
	canvasRef: React.RefObject<LentilleCanvasRef>;
	removeLentille: () => void;
}) {
	return (
		<div className="shadow-box">
			<h3
				style={{
					display: "inline-flex",
					flexDirection: "row",
					gap: "0.5em",
					alignItems: "center",
				}}
			>
				<FontAwesomeIcon
					onClick={() => {
						removeLentille();
					}}
					className="accent-hover"
					icon={faXmark}
					style={{ fontSize: "1.2em" }}
				/>
				Lentille {lentille.id}:
			</h3>

			<div className="lentilles-data">
				<div className="lentilles-inputs">
					<div>
						<span>
							OL<sub>{lentille.id}</sub> (position) :{" "}
						</span>
						<input
							type="number"
							onChange={(e) => {
								lentille.pos =
									Number(e.target.value) + (canvasRef.current?.size ?? 0);
								canvasRef.current?.refresh();
							}}
							value={lentille.pos - (canvasRef.current?.size ?? 0)}
						/>
					</div>

					<div>
						<span>f' (distance focale) : </span>
						<input
							type="number"
							onChange={(e) => {
								lentille.focalLength = Number(e.target.value);
								canvasRef.current?.refresh();
							}}
							value={lentille.focalLength}
						/>
					</div>
				</div>

				<div className="lentille-values">
					<span>
						{lentille.virtualImages ? "Image virtuelle" : "Image réelle"}
					</span>
					<div>
						<span>
							γ<sub>{lentille.id}</sub> (grandissement) =
						</span>
						<span>{lentille.gamma.toFixed(5)}</span>
					</div>
					<div>
						<span>
							OA<sub>{lentille.id}</sub> (position de l'image) =
						</span>
						<span>
							{(lentille.images?.x - (canvasRef.current?.size ?? 0)).toFixed(5)}
						</span>
					</div>
					<div>
						<span>
							A<sub>{lentille.id}</sub>B<sub>{lentille.id}</sub> (taille de
							l'image) =
						</span>
						<span>
							{lentille.images?.y !== undefined
								? (
										(canvasRef.current?.originY ?? 0) - lentille.images.y
									).toFixed(5)
								: undefined}{" "}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
