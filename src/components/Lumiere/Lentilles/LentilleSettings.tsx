import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LentilleCanvasRef } from "./LentillesCanvas";
import type { Lentille } from ".";

export function LentilleSettings({
	lentille,
	canvasRef,
	removeLentille,
}: {
	lentille: Lentille;
	canvasRef: React.MutableRefObject<LentilleCanvasRef>;
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

			<div className="lentilles-inputs">
				<div>
					<div>
						<span>
							OL<sub>{lentille.id}</sub> (position) :{" "}
						</span>
						<input
							type="number"
							onChange={(e) => {
								lentille.pos = Number(e.target.value) + canvasRef.current.size;
								canvasRef.current.refresh();
							}}
							value={lentille.pos - canvasRef.current?.size}
						/>
					</div>

					<div>
						<span>f' (distance focale) : </span>
						<input
							type="number"
							onChange={(e) => {
								lentille.focalLength = Number(e.target.value);
								canvasRef.current.refresh();
							}}
							value={lentille.focalLength}
						/>
					</div>
				</div>

				<div>
					<span>
						{lentille.virtualImage ? "Image virtuelle" : "Image réelle"}
					</span>
					<span>
						γ<sub>{lentille.id}</sub> (grandissement) = {lentille.gamma}
					</span>
					<span>
						OA<sub>{lentille.id}</sub> (position de l'image) ={" "}
						{lentille.imagePoint?.x - canvasRef.current?.size}
					</span>
					<span>
						A<sub>{lentille.id}</sub>B<sub>{lentille.id}</sub> (taille de
						l'image) ={" "}
						{lentille.imagePoint?.y !== undefined
							? canvasRef.current.originY - lentille.imagePoint.y
							: undefined}{" "}
					</span>
				</div>
			</div>
		</div>
	);
}
