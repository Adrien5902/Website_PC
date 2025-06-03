"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useCanvas from "../../hooks/Canvas";
import "./style.css";

function Graph() {
	const [table, setTable] = useState<number[][]>([
		[1, 2, 3],
		[4, 5, 6],
	]);

	function drawCanvas() {
		canvasRef.current?.getContext("2d");
	}

	const canvasRef = useCanvas(
		() => {
			drawCanvas();
		},
		undefined,
		1,
	);

	function InputKeyDown(e: React.KeyboardEvent, i: number, j: number) {
		const { key, target } = e;
		const TR = (target as HTMLInputElement).closest("tr");
		const nextTR = TR?.parentElement?.childNodes[i + 1];
		if (key === "Enter") {
			e.preventDefault();
			const nextTD = TR?.childNodes[j + 1] ?? nextTR?.childNodes[0];
			const input = nextTD?.firstChild;
			if (input) (input as HTMLElement).focus();
		} else if (key === "Tab") {
			e.preventDefault();
			const TD = nextTR?.childNodes[j];
			const input = TD?.firstChild;
			if (input) (input as HTMLElement).focus();
		}
	}

	function handlePlus(e: React.MouseEvent) {
		(e.target as HTMLElement).closest("td")?.querySelector("input")?.focus();
	}

	return (
		<>
			<table id="tableur">
				<tbody>
					{table.map((col, i) => (
						<tr key={i}>
							{col.map((row, j) => (
								<td key={j}>
									<input
										onKeyDown={(e) => InputKeyDown(e, i, j)}
										type="text"
										defaultValue={row}
									/>
								</td>
							))}
						</tr>
					))}
					<tr>
						{new Array(Math.max(...table.map((c) => c.length)))
							.fill(0)
							.map((_, i) => (
								<td key={i} onClick={handlePlus}>
									<span className="plus">
										<FontAwesomeIcon icon={faPlus} />
									</span>
									<input type="text" />
								</td>
							))}
					</tr>
				</tbody>
			</table>

			<canvas ref={canvasRef} />
		</>
	);
}

export default Graph;
