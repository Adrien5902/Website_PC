import { useEffect, useRef } from "react";
import type { Pos } from "../../types/canvas";

export default function useCanvas(
	onResize?: (size: Pos) => unknown,
	onFirstResize?: () => void,
	sizeCoef = 2,
) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		canvas.ondragover = (event) => {
			event.preventDefault();

			canvasRef.current.classList.add("draghover");
		};

		canvas.ondragleave = () => canvasRef.current.classList.remove("draghover");

		function resizeCanvas() {
			canvas.width = 0;
			canvas.height = 0;

			canvas.width = canvas.offsetWidth * sizeCoef;
			canvas.height = canvas.offsetHeight * sizeCoef;

			onResize?.({ x: canvas.width, y: canvas.height });
		}

		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);

		onFirstResize();
		return () => {
			// Cleanup event listener when the component unmounts
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [sizeCoef, onResize, onFirstResize]);

	return canvasRef;
}
