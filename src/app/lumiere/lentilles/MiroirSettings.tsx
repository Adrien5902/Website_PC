"use client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Miroir } from "./types";
import type { LentilleCanvasRef } from "./LentillesCanvas";

export function MiroirSettings({
	miroir,
	canvasRef,
	removeMiroir,
}: {
	miroir: Miroir;
	canvasRef: React.RefObject<LentilleCanvasRef>;
	removeMiroir: () => void;
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
						removeMiroir();
					}}
					className="accent-hover"
					icon={faXmark}
					style={{ fontSize: "1.2em" }}
				/>
				Miroir {miroir.id}:
			</h3>

			<div className="miroirs-data">
				<div className="miroirs-inputs">
					<div>
						<span>
							OM<sub>{miroir.id}</sub> (position) :{" "}
						</span>
						<input
							type="number"
							onChange={(e) => {
								miroir.pos =
									Number(e.target.value) + (canvasRef.current?.size ?? 0);
								canvasRef.current?.refresh();
							}}
							value={miroir.pos - (canvasRef.current?.size ?? 0)}
						/>
					</div>
				</div>

				<div className="miroir-values"></div>
			</div>
		</div>
	);
}
