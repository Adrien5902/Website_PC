import { useEffect, useRef } from "react";
import { Pos } from "../../types/canvas";

export default function useCanvas(
    onResize?: (size: Pos) => unknown,
    sizeCoef: number = 2,
) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current;

        if(!canvas) return

        canvas.ondragover = (event) => {
            event.preventDefault();

            canvasRef.current.classList.add("draghover");
        };

        canvas.ondragleave = () => canvasRef.current.classList.remove("draghover");

        function resizeCanvas() {
            const box = canvas.getBoundingClientRect();

            canvas.width = box.width * sizeCoef;
            canvas.height = box.height * sizeCoef;

            onResize && onResize({ x: canvas.width, y: canvas.height });
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => {
            // Cleanup event listener when the component unmounts
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return canvasRef
}